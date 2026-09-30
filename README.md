# Resolve Hub 🏙️
**Smart Municipal Issue Reporting Platform**

Resolve Hub is a full-stack, responsive web application designed to bridge the communication gap between citizens and municipal authorities in Tamil Nadu, India. It provides a centralized, transparent platform where community members can easily report local infrastructure issues (like potholes, broken streetlights, or sanitation problems) and local authorities can efficiently track, manage, and resolve them.

---

## ✨ Key Features

### For Citizens
* **Secure Authentication:** Easy registration and login process.
* **Issue Reporting:** Create detailed reports including a title, description, exact location, and photographic evidence.
* **Community Dashboard:** View a feed of all locally reported issues and track the real-time resolution status (Open, In Progress, Resolved) of your own reports.

### For Municipal Authorities
* **Admin Dashboard:** A secure, dedicated panel featuring vibrant analytics and stat cards summarizing total, open, pending, and resolved issues.
* **Issue Management:** Instantly review incoming reports and update their priority and status to keep the community informed.
* **User Directory:** Access a complete directory of all registered community members and fellow authorities.

### UI / UX
* **Modern Design:** Features a premium interface utilizing glassmorphism, animated background blobs, and sleek gradients.
* **Fully Responsive:** Beautifully adapts to desktops, tablets, and mobile devices.

---

## 🛠️ Technology Stack

**Frontend**
* [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) - Core framework and build tool
* [Tailwind CSS](https://tailwindcss.com/) - Styling and animations
* [Recharts](https://recharts.org/) - Dashboard data visualization
* [Lucide React](https://lucide.dev/) - Crisp, modern iconography

**Backend**
* [Java 17](https://www.oracle.com/java/) - Core programming language
* [Spring Boot 3](https://spring.io/projects/spring-boot) - REST API framework
* [Spring Data JPA (Hibernate)](https://spring.io/projects/spring-data-jpa) - ORM and data persistence

**Database**
* [MySQL](https://www.mysql.com/) - Relational database management (hosted locally via XAMPP)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js & npm** (for the frontend)
* **Java Development Kit (JDK) 17** (for the backend)
* **XAMPP** (or any local MySQL server)
* **Maven** (optional, the project includes an embedded Maven wrapper)

### 1. Database Setup
1. Open the XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open your browser and go to `http://localhost/phpmyadmin/`.
3. Create a new database named `resolvehub`.

### 2. Running the Backend (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Note: If you do not have Maven installed globally, you can use the embedded executable provided in the project folder).*
3. The backend server will start on **`http://localhost:8080`**.

### 3. Running the Frontend (React + Vite)
1. Open a **new, separate terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required npm dependencies (only required the first time):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on **`http://localhost:3000`** (or `5173`). Open this link in your browser to view the application!

---

## 📂 Project Structure

```text
Resolve_Hub/
├── backend/                  # Java Spring Boot Application
│   ├── src/main/java/        # Controllers, Models, Repositories, Services
│   ├── src/main/resources/   # application.properties (Database config)
│   └── pom.xml               # Maven dependencies
│
└── frontend/                 # React + Vite Application
    ├── src/
    │   ├── components/       # Reusable React components (Dashboards, Auth, UI)
    │   ├── App.jsx           # Main application routing
    │   └── index.css         # Global Tailwind styles
    ├── package.json          # npm dependencies
    └── vite.config.js        # Vite build configuration
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available under the MIT License.
