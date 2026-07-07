# Software Requirements Specification (SRS)
# StockNet – Inventory, Procurement & Menu Management System

Version: 1.0
Date: 5 July 2026
Client: Lucky Summer SDA Church Store and Kitchen Operations
Prepared By: System Analyst / Developer

---

## 1. Introduction

This document defines the software requirements for StockNet, a web-based management system designed for the Lucky Summer SDA Church store and kitchen operations. The system will support inventory control, procurement tracking, menu planning, and stock movement monitoring in a simple, reliable, and cost-effective manner.

The primary purpose of StockNet is to improve operational efficiency, reduce stock wastage, strengthen accountability, and support better purchasing decisions for church store and kitchen activities.

---

## 2. Project Overview

### 2.1 Project Name
StockNet

### 2.2 Project Purpose
StockNet will provide a centralized platform for managing inventory, procurement, food items, supplier information, stock issuing, menu planning, and reporting. The system is intended to replace manual processes with a digital workflow that is easier to maintain and audit.

### 2.3 Primary Goal
To reduce stock losses, prevent kitchen shortages, improve accountability, and support data-driven purchasing decisions for the church store and kitchen.

### 2.4 Expected Benefits
- Reduced emergency purchases
- Lower food wastage
- Improved stock accuracy
- Better supplier planning
- Reduced manual paperwork
- Faster reporting and decision-making

---

## 3. Business Objectives

The system shall help the organization to:
- Provide real-time inventory visibility
- Track every stock movement
- Forecast shortages based on planned menus
- Improve procurement planning
- Increase accountability through user activity tracking
- Generate management reports automatically
- Reduce dependence on paper-based stock records

---

## 4. Scope of the System

### 4.1 In Scope
The system shall include the following modules:
- Inventory management
- Procurement recording
- Stock receiving
- Stock issuing
- Menu planning
- Recipe and ingredient management
- Alerts and notifications
- Reporting and analytics
- User management
- Church profile and operational settings

### 4.2 Out of Scope (Phase 1)
The following features are not included in the initial phase:
- Mobile application
- Barcode scanning
- SMS integration
- Accounting integration
- Multi-branch support

---

## 5. User Roles and Permissions

The system shall support role-based access control.

| Role | Permissions |
|---|---|
| Administrator | Full system access, user management, configuration, reports |
| Procurement Officer | Record purchases, view alerts, view reports, manage suppliers |
| Storekeeper | Receive stock, issue stock, view inventory, update stock movements |
| Kitchen Manager (Optional) | View menus, review ingredient requirements, view stock alerts |

---

## 6. Functional Requirements

### 6.1 Inventory Management
The system shall allow users to:
- Create, edit, and deactivate inventory items
- Define units, prices, and reorder levels
- View current stock balances
- Record stock movements with dates and descriptions
- Track expiry dates where applicable

### 6.2 Procurement Management
The system shall allow users to:
- Record purchases and supplier transactions
- Store supplier information
- Capture invoice numbers
- Update stock automatically after receiving goods
- View procurement history and payment status where relevant

### 6.3 Stock Issuing
The system shall:
- Allow issue of items to departments or operational areas
- Prevent negative stock balances
- Record receiver, purpose, and issue date
- Update balances immediately after issuance

### 6.4 Menu Planning
The system shall:
- Create weekly and periodic menus
- Define breakfast, lunch, and dinner plans
- Link menu items to recipes and required ingredients

### 6.5 Recipe Management
The system shall:
- Store dishes and food preparations
- Store ingredients and required quantities
- Calculate ingredient requirements for planned menus
- Support easy recipe updates when stock or menu changes

### 6.6 Alerts and Notifications
The system shall generate:
- Low-stock alerts
- Menu shortage alerts
- Expiry warnings
- Overstock alerts
- Procurement reminders for critical items

### 6.7 User and Settings Management
The system shall allow the administrator to:
- Create and manage users
- Assign roles and permissions
- Configure church profile information
- Manage basic operational settings

---

## 7. Non-Functional Requirements

| Requirement | Target |
|---|---:|
| Performance | Dashboard and key screens should load within 2 seconds under normal use |
| Availability | 99.9% target for hosted deployment |
| Security | JWT-based authentication and HTTPS encryption |
| Scalability | Support 10,000+ inventory items and growing transaction data |
| Usability | Responsive design for desktop and tablet use |
| Reliability | Atomic transactions for stock updates and procurement entries |
| Maintainability | Clean modular architecture for future expansion |

---

## 8. System Architecture

### 8.1 Frontend
- Angular 20+
- Angular Material
- Tailwind CSS
- Chart.js

### 8.2 Backend
- Django
- Django REST Framework
- JWT Authentication

### 8.3 Database
- SQLite for development
- PostgreSQL for production deployment

### 8.4 Deployment Considerations
The system shall be deployable on low-cost cloud hosting platforms with free or affordable tiers for initial rollout.

---

## 9. Database Requirements

The system shall store and manage the following core entities:
- Users
- Roles
- Items
- Categories
- Suppliers
- Purchases
- Stock Transactions
- Menus
- Recipes
- Alerts
- Audit Logs
- Church Profile

The database design shall support historical tracking, reporting, and future expansion.

---

## 10. User Interface Requirements

The user interface shall be professional, simple, and easy to use for non-technical users.

The UI shall include:
- Login page
- Role-based dashboards
- Sidebar navigation
- Data tables with search and filters
- Charts and analytics
- Responsive forms
- Notification panel
- Dark/light theme readiness
- Clear labels suitable for church operational staff

---

## 11. Reports and Analytics

The system shall generate the following reports:
- Inventory report
- Purchase report
- Issue report
- Supplier report
- Low-stock report
- Menu demand report
- Audit log report
- PDF and Excel export support

Management users shall be able to review operational performance and identify shortages or overstock situations quickly.

---

## 12. Security Requirements

The system shall include:
- Role-based access control
- Encrypted passwords
- JWT authentication
- HTTPS deployment
- Audit logging of critical actions
- Session timeout for inactive users
- Validation rules to prevent invalid or duplicate records

---

## 13. Implementation Plan

| Phase | Deliverable |
|---|---|
| Phase 1 | Frontend prototype and dashboard layout |
| Phase 2 | Django API and core database models |
| Phase 3 | Authentication, roles, and access control |
| Phase 4 | Reports, alerts, and operational workflows |
| Phase 5 | Testing, deployment, and user acceptance |

---

## 14. Budget and ROI Considerations

### 14.1 Recommended Low-Cost Stack
| Component | Cost Approach |
|---|---|
| Angular | Free |
| Django | Free |
| PostgreSQL | Free / low-cost hosting |
| GitHub | Free |
| Render / Railway / Neon | Free tier or low-cost options available |

### 14.2 Expected ROI
The proposed system is expected to provide value through:
- Reduced stock losses
- Reduced emergency purchases
- Reduced manual reporting time
- Better procurement planning
- Stronger accountability and auditability

### 14.3 Decision Threshold
Proceed to full backend development when the frontend prototype demonstrates clear operational value and stakeholder adoption.

---

## 15. Risk Assessment

| Risk | Mitigation |
|---|---|
| Poor user adoption | Provide simple UI and practical training |
| Data entry errors | Use validation rules and required fields |
| Stock inaccuracies | Implement audit trails and review workflows |
| Server downtime | Use backups and reliable hosting |
| Unauthorized access | Enforce role-based permissions and secure authentication |

---

## 16. Future Enhancements

Future enhancements may include:
- Barcode or QR scanning
- Mobile application
- SMS alerts
- AI-based demand forecasting
- OCR invoice scanning
- Multi-branch support
- Accounting integration
- Budget tracking
- Approval workflows

---

## 17. Approval Statement

This SRS defines the functional, technical, and operational requirements for the StockNet Inventory, Procurement & Menu Management System. It is intended to guide frontend development, backend implementation, testing, deployment, and future expansion while maintaining a low-cost, high-ROI strategy suitable for Lucky Summer SDA Church operations.
