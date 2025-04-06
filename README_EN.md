# LocalStorage Labyrinth

[中文](README.md) | English

<p align="center">
  <img src="icons/main-logo.svg" alt="LocalStorage Labyrinth Logo" width="120" height="120"/>
</p>

> 🔐 A cyberpunk-style LocalStorage data encryption management Chrome extension

## 📖 Project Introduction

LocalStorage Labyrinth is a secure Chrome extension designed to protect browser local storage data. It uses Advanced Encryption Standard (AES-GCM) to encrypt sensitive data in LocalStorage, ensuring your data remains secure even if the browser is compromised.

## ✨ Key Features

- **Powerful Encryption Protection**: Uses AES-GCM 256-bit encryption algorithm to provide military-grade security for your data
- **Flexible Key Management**: Create, save, and manage multiple encryption keys to provide different levels of protection for different data
- **Intuitive User Interface**: Cyberpunk-style UI design, providing a smooth and visually engaging user experience
- **Simple to Use**: Streamlined operation process, one-click encryption and decryption of data
- **Secure Deletion**: Securely clear sensitive data and keys

## 🚀 Installation and Usage

### Installation Method

1. Download the code from this repository
2. Open Chrome browser, go to the extension management page (`chrome://extensions/`)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked extension"
5. Select this project folder

### Usage Guide

1. **Generate Key**:
   - Click the extension icon to open the interface
   - Enter a custom name in the key name input box (optional)
   - Click the "Generate New Key" button

2. **Encrypt Data**:
   - Select a key from the dropdown menu
   - Enter the data to be encrypted in the text box
   - Click the "Encrypt & Save" button

3. **Decrypt Data**:
   - Select the corresponding key from the dropdown menu
   - Click the "Decrypt Data" button
   - The decrypted data will be displayed in the text box

4. **Delete Key**:
   - Select the key to be deleted from the dropdown menu
   - Click the "Delete Key" button
   - Confirm the deletion operation

## 🔧 Technical Implementation

### Core Technologies

- **Web Crypto API**: Uses the browser's built-in encryption API to implement high-performance encryption and decryption operations
- **Chrome Storage API**: Securely stores encryption keys and encrypted data
- **AES-GCM Algorithm**: Provides high-strength encryption protection, including data integrity verification
- **Modern JavaScript**: Uses ES6+ classes and asynchronous programming patterns

### Architecture Design

The project adopts a modular design, mainly containing three core classes:

1. **KeyManager**: Responsible for key generation, storage, retrieval, and deletion
2. **CryptoManager**: Handles data encryption and decryption operations
3. **UIManager**: Manages user interface interactions and event handling

## 🎨 UI Design

LocalStorage Labyrinth adopts a cyberpunk style design, featuring:

- Dark backgrounds contrasted with neon colors
- Dynamic glow effects and gradient colors
- Futuristic fonts and icons
- Smooth animations and interactive effects

Main color scheme includes:
- Deep blue (`#2A2356`)
- Crystal purple (`#4C3B8A`)
- Cyber blue (`#00F3FF`)
- Neon pink (`#FF4D7C`)

## 📝 Notes

- Please keep your keys safe. Once a key is lost, encrypted data cannot be recovered
- This extension only encrypts data in LocalStorage and does not affect other storage mechanisms
- For best security, it is recommended to change keys regularly

## 📜 License

This project is licensed under the MIT License

---

<p align="center">Protecting your data security in the digital labyrinth</p>