# PayStride — Backend context

Project: paystride-backend
Package: com.paystride
Stack: Spring Boot 3.2.5, Java 17
Dependencies: web, jpa, security,
mysql, devtools, lombok, jjwt 0.12.3,
validation
DB: paystride_db, localhost:3306

CORS: allow http://localhost:5173

Rules:
- No lambda expressions
- BigDecimal only for money
- TenantContext.get() in every service
- BCrypt all passwords
- JWT has: userId, companyId, role

Tables: companies, users, workers,
daily_hours, payroll_summary