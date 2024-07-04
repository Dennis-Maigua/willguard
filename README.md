[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT license.

# Overview

WillGuard is a decentralized application (DApp) leveraging blockchain technology and smart contracts to streamline the creation and execution of wills.
This DApp offers users a reliable and efficient solution for managing their testamentary wishes.
It also offers a user-friendly platform that ensures the accurate execution of testamentary wishes while maintaining the highest standards of security and privacy.

### Software Requirements:

>**Note**: It is necessary to download the following desktop applications for your Windows, Mac, or Linux OS.

1. [Git](https://git-scm.com/downloads)

2. [Node.js](https://nodejs.org/en/download/package-manager)

3. [MongoDB](https://www.mongodb.com/try/download/community)

4. [Ganache](https://archive.trufflesuite.com/ganache/)

6. [MetaMask](https://MetaMask.io/download/)

# Setup Installation:

### Step 1. Clone the Repository

Open a new terminal, and run the following commands step-by-step:

```bash
    $ cd Desktop
    $ git clone https://github.com/Dennis-Maigua/willguard.git
```

### Step 2. Install Packages and Dependencies

Open another terminal separately, and install all the requirements for the project.

- Terminal 1 (Backend):

```bash
    $ cd Destop/willguard/server
    $ npm i
```

- Terminal 2 (Frontend):

```bash
    $ cd Destop/willguard/client
    $ npm i
    $ npm i -g truffle
```

### Step 3. Connect Ganache to MetaMask & your Project

- Open Ganache in your local desktop, and click `New Workspace (Ethereum)`.

- Click `Add Project`, navigate to where the `truffle.config.js` file is in the project folder, select it, and click `Start`.

- Pick any `Address` below the first one, click on its `key` on the right side, and copy its `Private Key`.

- Open MetaMask in your Browser, and proceed to `Create a new Wallet`.

- Click `Ethereum Mainnet` >> `+ Add network` >> `Add a network manually`.

- Enter Network name: `Ganache`, New RPC URL: `HTTP://127.0.0.1:7545`, Chain ID: `1337`, Currency symbol: `ETH`.

- Then click `Save` >> `Migrate to Ganache` >> `Account 1` >> `+ Add account or hardware wallet` >> `Import account`.

- Paste in the Private Key that you had copied from Ganache, and finally click `Import`.

>**Note**: Do not close Ganache from this point onwards, otherwise it will reset everything and you will have to repeat this process again manually. However, you can close it when you are done with the project.

### Step 4. Compile & Deploy Smart Contracts

Go back to `Terminal 2` above, and run the commands below:

```bash
    $ truffle compile
    $ truffle migrate --network development
```

>**Note**: Steps 3 and 4 have to be repeated every time you are running the project from a fresh start.

### Step 5. Run the Project

Run the following command in both terminals, to start the `client` and `server`.

- Terminal 1 and 2:

```bash
    $ npm start
```

>**Note**: If everything is set up correctly, you should see the web application running smoothly in your Web Browser provided you have all the requirements needed.
   
# Contributing:

We welcome contributions from developers, IT experts, and technology enthusiasts. Feel free to fork the repository, make improvements, and submit pull requests.
