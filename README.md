# 🧠 Decentralized Task Bounty Board

## 🚀 Overview

A decentralized platform built on the Algorand blockchain that enables clients to post tasks with rewards, and freelancers to claim and complete them. Rewards are securely managed using Algorand smart contracts and distributed through Pera Wallet integration.

---

## ✨ Features

- 📝 Post and manage bounties
- 👨‍💻 Freelancers can request and complete tasks
- 🔒 Funds secured using ARC4 smart contracts
- 🔗 Pera Wallet integration for seamless transactions
- 🧩 Modular architecture across Backend, Smart Contracts, and Frontend

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js (Vite)                     |
| Backend    | Django (Python)                     |
| Blockchain | Algorand (via AlgoKit + ARC4)       |
| Wallet     | Pera Wallet (WalletConnect)         |

---

## ⚙️ Getting Started

### ✅ Prerequisites

- npm  
- Python 3 & pip  
- Algorand TestNet account  
- Pera Wallet (Browser Extension or Mobile App)  

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