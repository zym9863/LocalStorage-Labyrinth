// 密钥管理
class KeyManager {
  constructor() {
    this.keyPrefix = 'labyrinth_key_';
  }

  async generateKey(customName) {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );

    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyId = this.generateKeyId(customName);
    const keyData = {
      id: keyId,
      key: Array.from(new Uint8Array(exportedKey))
    };

    await this.saveKey(keyId, keyData);
    return keyId;
  }

  generateKeyId(customName) {
    return customName ? customName : 'key_' + Date.now();
  }

  async saveKey(keyId, keyData) {
    await chrome.storage.local.set({ [this.keyPrefix + keyId]: keyData });
  }

  async getKey(keyId) {
    const result = await chrome.storage.local.get(this.keyPrefix + keyId);
    const keyData = result[this.keyPrefix + keyId];
    if (!keyData) return null;

    const keyArray = new Uint8Array(keyData.key);
    return await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  }

  async listKeys() {
    const result = await chrome.storage.local.get(null);
    return Object.keys(result)
      .filter(key => key.startsWith(this.keyPrefix))
      .map(key => ({
        id: key.replace(this.keyPrefix, ''),
        data: result[key]
      }));
  }

  async deleteKey(keyId) {
    await chrome.storage.local.remove(this.keyPrefix + keyId);
  }
}

// 加密管理
class CryptoManager {
  constructor(keyManager) {
    this.keyManager = keyManager;
  }

  async encrypt(data, keyId) {
    const key = await this.keyManager.getKey(keyId);
    if (!key) throw new Error('密钥不存在');

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedData
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    };
  }

  async decrypt(encryptedObj, keyId) {
    const key = await this.keyManager.getKey(keyId);
    if (!key) throw new Error('密钥不存在');

    const iv = new Uint8Array(encryptedObj.iv);
    const encryptedData = new Uint8Array(encryptedObj.data);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }
}

// UI管理
class UIManager {
  constructor(keyManager, cryptoManager) {
    this.keyManager = keyManager;
    this.cryptoManager = cryptoManager;
    this.initializeUI();
  }

  async initializeUI() {
    this.updateKeyList();
    this.setupEventListeners();
  }

  async updateKeyList() {
    const keySelect = document.getElementById('keySelect');
    const keys = await this.keyManager.listKeys();
    
    keySelect.innerHTML = '<option value="">选择已保存的密钥</option>';
    keys.forEach(key => {
      const option = document.createElement('option');
      option.value = key.id;
      option.textContent = key.id;
      keySelect.appendChild(option);
    });
  }

  setupEventListeners() {
    document.getElementById('generateKey').addEventListener('click', () => this.handleGenerateKey());
    document.getElementById('encryptBtn').addEventListener('click', () => this.handleEncrypt());
    document.getElementById('decryptBtn').addEventListener('click', () => this.handleDecrypt());
    document.getElementById('clearBtn').addEventListener('click', () => this.handleClear());
    document.getElementById('deleteKey').addEventListener('click', () => this.handleDeleteKey());
  }

  showMessage(message, isError = false) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `alert ${isError ? 'alert-danger' : 'alert-info'}`;
    messageBox.style.display = 'block';

    setTimeout(() => {
      messageBox.style.display = 'none';
    }, 3000);
  }

  async handleGenerateKey() {
    try {
      const customName = document.getElementById('keyNameInput').value.trim();
      const keyId = await this.keyManager.generateKey(customName);
      await this.updateKeyList();
      this.showMessage(`新密钥已生成: ${keyId}`);
      document.getElementById('keyNameInput').value = '';
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }

  async handleEncrypt() {
    const keyId = document.getElementById('keySelect').value;
    const data = document.getElementById('dataInput').value;

    if (!keyId) {
      this.showMessage('请先选择密钥', true);
      return;
    }

    if (!data) {
      this.showMessage('请输入要加密的数据', true);
      return;
    }

    try {
      const encryptedData = await this.cryptoManager.encrypt(data, keyId);
      await chrome.storage.local.set({ encryptedData: encryptedData });
      this.showMessage('数据已加密并保存');
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }

  async handleDecrypt() {
    const keyId = document.getElementById('keySelect').value;

    if (!keyId) {
      this.showMessage('请先选择密钥', true);
      return;
    }

    try {
      const result = await chrome.storage.local.get('encryptedData');
      if (!result.encryptedData) {
        this.showMessage('没有找到加密数据', true);
        return;
      }

      const decryptedData = await this.cryptoManager.decrypt(result.encryptedData, keyId);
      document.getElementById('dataInput').value = decryptedData;
      this.showMessage('数据已解密');
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }

  async handleClear() {
    document.getElementById('dataInput').value = '';
    await chrome.storage.local.remove('encryptedData');
    this.showMessage('数据已清除');
  }

  async handleDeleteKey() {
    const keyId = document.getElementById('keySelect').value;
    
    if (!keyId) {
      this.showMessage('请先选择要删除的密钥', true);
      return;
    }

    if (!confirm('确定要删除这个密钥吗？删除后无法恢复，且使用该密钥加密的数据将无法解密。')) {
      return;
    }

    try {
      await this.keyManager.deleteKey(keyId);
      await this.updateKeyList();
      this.showMessage(`密钥 ${keyId} 已删除`);
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const keyManager = new KeyManager();
  const cryptoManager = new CryptoManager(keyManager);
  new UIManager(keyManager, cryptoManager);
});