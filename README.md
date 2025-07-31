# 🧠 Decentralized Task Bounty Board

## 🚀 Overview

BountyBoard is a decentralized task bounty platform built using modern full-stack tools and blockchain. It allows clients to post tasks with rewards, freelancers to complete them, and community members to participate in platform governance via DAO voting. 

This platform uses:
- Django Rest Framework (DRF) for backend APIs
- React + Vite for a modern, fast frontend
- Algorand blockchain for decentralized task reward settlement using ARC4 smart contracts
- AlgoPy for smart contract development
- Pera Wallet integration for user transactions and authentication

Users are assigned roles:
- **Clients** can post and manage bounties
- **Freelancers** can apply and complete tasks
- **Governors** can participate in DAO-based voting and governance decisions

Role-based access ensures only relevant pages and actions are shown to each user type.

---

## ✨ Features

- 📝 Post and manage bounties
- 👨‍💻 Freelancers can request and complete tasks
- 🔒 Funds secured using ARC4 smart contracts
- 🔗 Pera Wallet integration for seamless transactions
- 🧩 Modular architecture across Backend, Smart Contracts, and Frontend

---

## 🛠 Tech Stack

| Feature     | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React.js (Vite)                     |
| Backend     | Django REST Framework               |
| Blockchain  | Algorand (AlgoKit + AlgoPy + ARC4)  |
| Wallet      | Pera Wallet (WalletConnect)         |
| Governance  | DAO Voting with Smart Contracts     |
| Auth        | Token Based Auth & Role-Based Access Control     |

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended) and npm
- Python 3.10+ and pip
- Algorand TestNet account with MyAlgo Wallet or Pera Wallet
- AlgoKit installed globally
- Git

### 💻 Quick Start for Beginners

1. Clone the repo:  
   `git clone https://github.com/Paul-Jonathan2005/BountyBoard.git && cd BountyBoard`

2. Set up backend (Django):
   ```
   python -m venv env
   source env/bin/activate  # or .\env\Scripts\activate on Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. Set up frontend (React + Vite):
   ```
   cd Frontend/my-app
   npm install
   npm run dev
   ```

4. Deploy or simulate smart contracts:
   ```
   cd ../../Bounty_Smart_Contract
   algokit localnet start
   algokit deploy
   ```

5. Open the frontend URL (usually http://localhost:5173) in your browser.

---

### 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Paul-Jonathan2005/BountyBoard.git
cd BountyBoard
```

2. **Set up the Backend (Django)**

```bash
cd BountyBoard
python -m venv env
source env/bin/activate  # or .\env\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py runserver
```

3. **Set up the Frontend**

```bash
cd ../Frontend/my-app
npm install
npm run dev
```

4. **Deploy/Simulate Smart Contracts**

```bash
cd ../../Bounty_Smart_Contract
algokit localnet start
algokit deploy
```

---

## 🧪 Usage

1. 🔗 Connect your wallet (Pera Wallet)  
2. 🧾 Clients can post bounties with title, description, deadline, and reward  
3. 🙋 Freelancers can view and request bounties  
4. ✅ Clients accept the request and fund the smart contract  
5. 🪙 On completion, smart contract releases payment to freelancer  

---

## 📂 Project Structure

```
BountyBoard/
├── bountyboard/               # Django backend logic
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── bounties/                  
├── user/                      
├── env/                       
├── manage.py                  
│
├── Bounty_Smart_Contract/     # Algorand smart contract logic
│   ├── projects/
│   └── *.py (contract, deployment)
│
├── Frontend/
│   └── my-app/                # React frontend app
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── css/
│       │   ├── layout/
│       │   ├── pages/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
```

---

## 🏛️ Governance and DAO System

- This platform includes a basic DAO system.
- Clients and verified users can propose changes or vote on improvements.
- Governance UI is visible only to users with the proper role.
- All votes and decisions are recorded and executed via Algorand smart contracts.


### 👥 Who Can Participate?

- Verified users with the **Governor** role can participate in governance.
- These may include trusted freelancers, clients, or community members approved by the system.
- Optionally, reputation or activity levels may determine eligibility to vote.

### 🎁 Voter Rewards

- To appreciate their time and participation, **voters will be rewarded** for contributing to governance decisions.
- Rewards may include tokens, priority access, or other platform benefits.

## 🧑‍💼 Role-Based Access System

- **Client Role**: Can post bounties, fund smart contracts, and view/manage their tasks.
- **Freelancer Role**: Can browse bounties, submit work, and receive payments.
- **Governor Role**: Can participate in governance proposals and voting.
- Pages and navigation dynamically adjust based on authenticated user role.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request. Suggestions, issues, and improvements are encouraged.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

- **Paul Jonathan**  
  GitHub: [Paul-Jonathan2005](https://github.com/Paul-Jonathan2005)

---

## 📬 Contact

For any questions or feedback, feel free to reach out:

- 📧 Email: kakanijonathan@gmail.com