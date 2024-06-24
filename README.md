[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT license.

# Overview

WillGuard is a decentralized application (DApp) leveraging blockchain technology and smart contracts to streamline the creation and execution of wills.
By harnessing the transparency, security, and immutability of blockchain, this DApp offers users a reliable and efficient solution for managing their testamentary wishes.
Traditional will-making processes are often cumbersome, prone to errors, and subject to legal complexities.
The Automated Wills DApp revolutionizes this process, offering a user-friendly platform that ensures the accurate execution of testamentary wishes while maintaining the highest standards of security and privacy.

### Key Features:

- **Smart Contract Execution**: Smart contracts autonomously execute the terms of the will, ensuring accuracy and reliability.
- **Immutable Records**: All wills are securely stored on the blockchain, safeguarding them against tampering or loss.
- **Decentralized Access**: Users can access and update their wills from anywhere in the world, without reliance on intermediaries.
- **Privacy Protection**: Encryption protocols safeguard sensitive information, granting users peace of mind regarding data security.
- **Legacy Planning Tools**: Additional features facilitate comprehensive legacy planning, including asset distribution and beneficiary management.

# Environment and Setup:

>**Note**: Make sure you have installed the latest version of [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/en/download/package-manager), and [MongoDB](https://www.mongodb.com/try/download/community) before proceeding.

### 1. Clone the Repository

Download the project to your local machine (Desktop):

```bash
    $ cd Desktop
    $ git clone https://github.com/Dennis-Maigua/mern-auth-web.git
    $ exit
```

### 2. Run the Backend and Frontend

Open the project folders in 2 terminals, install their packages/dependencies, and run them seperately:

- Terminal 1 (Backend/Server):

```bash
    # using npm
    $ cd Destop/mern-auth-web/server
    $ npm i
    $ npm start

    # OR using Yarn
    $ cd Desktop/mern-auth-web/server
    $ yarn add
    $ yarn start
```

- Terminal 2 (Frontend/Client):

```bash
    # using npm
    $ cd Destop/mern-auth-web/client
    $ npm i
    $ npm start

    # OR using Yarn
    $ cd Desktop/mern-auth-web/client
    $ yarn add
    $ yarn start
```

### 3. (Optional) Update the Packages/Dependencies

If you want to keep all packages and dependencies up-to-date, run on both terminals:

```bash
    # using npm
    $ npm i -g npm-check-updates
    $ ncu -u
    $ npm install

    # OR using Yarn
    $ yarn add -g yarn-check-updates
    $ ncu -u
    $ yarn add
```

If everything is set up correctly, you should see your new app running in your Android Emulator or iOS Simulator shortly provided you have set it up correctly.

This is one way to run your app — you can also run it directly from within your Smartphone Device, or Android Studio, and Xcode respectively.
   
# Contributing:

We welcome contributions from developers, technology experts, and blockchain enthusiasts. Feel free to fork the repository, make improvements, and submit pull requests.
