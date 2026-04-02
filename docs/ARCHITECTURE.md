# PayStride Architecture & Technical Documentation

## 1. Project Overview

### Problem Statement

Small and mid-sized enterprises (SMEs) often lack the infrastructure to manage payroll, workforce attendance, and employee self-service efficiently. PayStride addresses this by providing an integrated, multi-tenant web application that enables:

- **Administrators** to manage workers, log daily hours, generate payroll, and review HR requests
- **Workers** to access their attendance records, download payslips, and submit advance/leave requests
- **Companies** to maintain data isolation through a tenant-based architecture

### Business Goals

- Simplify payroll operations for non-technical HR teams
- Reduce manual data entry and payroll processing errors
- Provide workers with transparent access to their attendance and earnings
- Support HR workflows for advance/leave request management
- Enable companies to generate compliance-ready payroll reports

### Key Features Delivered

1. **Multi-Tenant Architecture**: Complete data isolation per company
2. **Dual Portal System**: Separate admin and worker interfaces
3. **Payroll Generation**: Automated payslip generation with PDF export
4. **Attendance Tracking**: Daily hour logging with validation
5. **Worker Self-Service**: Leave and advance request submission
6. **JWT-Based Security**: Stateless authentication with token expiry
7. **Dashboard Analytics**: Real-time insights for administrators

---

## 2. System Architecture

### 2.1 High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
├──────────────────────┬──────────────────────────────────────┤
│  Admin Dashboard     │  Worker Portal                        │
│  (React 18 + Vite)   │  (React 18 + Vite)                   │
└──────────┬───────────┴──────────────┬───────────────────────┘
           │                          │
           │   HTTP/REST APIs         │
           │   (JWT Authorization)    │
           └──────────┬───────────────┘
                      │
        ┌─────────────v──────────────┐
        │   Spring Boot Backend       │
        │   Application Server       │
        ├───────────────────────────┤
        │ Controllers (REST)         │
        │ Services (Business Logic)  │
        │ Repositories (Data Access) │
        │ Security (JWT + Filters)   │
        └─────────────┬──────────────┘
                      │
                      │ JDBC/JPA
                      │
        ┌─────────────v──────────────┐
        │     MySQL Database          │
        │  - Companies                │
        │  - Users                    │
        │  - Workers                  │
        │  - Hours/Payroll/Requests   │
        └────────────────────────────┘
```

### 2.2 Frontend Architecture

#### Technology Stack
- **Framework**: React 18 with Vite build tool
- **State Management**: React Context API (AuthContext)
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS Modules
- **PDF Generation**: jsPDF + jsPDF-AutoTable

#### Component Structure

```
src/
├── App.jsx                           // Main routing hub
├── main.jsx                          // React DOM entry
├── components/
│   ├── Navbar.jsx                   // Navigation bar
│   ├── Footer.jsx                   // Footer component
│   ├── ProtectedRoute.jsx           // Route guard for auth
│   ├── ChangePasswordModal.jsx      // Password reset modal
│   └── PasswordField.jsx            // Secure password input
├── context/
│   └── AuthContext.jsx              // Global auth state
├── pages/
│   ├── HomePage.jsx                 // Landing page
│   ├── LoginPage.jsx                // Admin login
│   ├── RegisterPage.jsx             // Admin registration
│   ├── DashboardPage.jsx            // Admin dashboard
│   ├── WorkersPage.jsx              // Worker management
│   ├── HoursPage.jsx                // Hour logging
│   ├── PayrollPage.jsx              // Payroll management
│   ├── RequestsPage.jsx             // HR request review
│   ├── WorkerLoginPage.jsx          // Worker authentication
│   ├── WorkerDashboard.jsx          // Worker self-service
│   ├── ForgotPasswordPage.jsx       // Password recovery
│   └── [additional worker pages]
├── services/
│   └── api.js                       // Axios API client
└── utils/
    ├── format.js                    // Date/number formatting
    └── pdfUtils.js                  // PDF generation utilities
```

#### AuthContext Pattern
The application uses Context API for authentication state management:

```javascript
// Provides:
- currentUser: authenticated user object
- isAuthenticated: boolean flag
- login(): token-based authentication
- logout(): session cleanup
- setCurrentUser(): state updates
```

### 2.3 Backend Architecture

#### Technology Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3
- **Web**: Spring Web MVC
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA (Hibernate)
- **Database**: MySQL 8.0+
- **Build Tool**: Maven
- **Additional**: Lombok (boilerplate reduction)

#### Layered Architecture

```
com.paystride/
├── PaystrideApplication.java        // Spring Boot entry point
├── config/
│   ├── SecurityConfig.java          // JWT & auth filter setup
│   ├── JwtAuthenticationFilter.java // Token validation
│   ├── TenantContext.java           // Company isolation
│   └── [other configurations]
├── controller/                      // API Endpoints
│   ├── AuthController.java          // Admin registration/login
│   ├── WorkerController.java        // Worker CRUD
│   ├── DailyHoursController.java    // Hour logging
│   ├── PayrollController.java       // Payroll generation
│   ├── DashboardController.java     // Analytics endpoints
│   ├── HRManagementController.java  // Request review
│   └── WorkerPortalController.java  // Worker self-service
├── service/                         // Business Logic
│   ├── AuthService.java             // Authentication logic
│   ├── WorkerService.java           // Worker operations
│   ├── DailyHoursService.java       // Hour tracking
│   ├── PayrollService.java          // Payroll calculations
│   └── [other services]
├── repository/                      // Data Access (Spring Data JPA)
│   ├── CompanyRepository.java
│   ├── UserRepository.java
│   ├── WorkerRepository.java
│   ├── DailyHoursRepository.java
│   └── [other repositories]
├── entity/                          // JPA Domain Models
│   ├── Company.java
│   ├── User.java
│   ├── Worker.java
│   ├── DailyHours.java
│   ├── PayrollSummary.java
│   ├── AdvanceRequest.java
│   └── LeaveRequest.java
├── dto/                             // Request/Response Contracts
│   ├── AuthRequestDTO.java
│   ├── WorkerResponseDTO.java
│   ├── DailyHoursDTO.java
│   └── [other DTOs]
├── exception/                       // Custom Exceptions
│   ├── ResourceNotFoundException.java
│   ├── AuthenticationException.java
│   └── [other exceptions]
└── util/                            // Utility Classes
    ├── PayrollCalculator.java       // Salary computation logic
    └── [other utilities]
```

### 2.4 Database Schema (Conceptual)

#### Core Entities

**Company**
```sql
- company_id (PK)
- company_name
- industry
- created_at
- updated_at
```

**User (Admin)**
```sql
- user_id (PK)
- company_id (FK)
- email (unique per company)
- password_hash
- full_name
- role (ADMIN, HR, MANAGER)
- created_at
```

**Worker**
```sql
- worker_id (PK)
- company_id (FK)
- worker_code (unique per company)
- full_name
- email
- phone
- designation
- salary
- password_hash
- created_at
```

**DailyHours**
```sql
- hours_id (PK)
- worker_id (FK)
- company_id (FK)
- work_date
- hours_worked
- status (PENDING, APPROVED, REJECTED)
- notes
- created_at
```

**PayrollSummary**
```sql
- payroll_id (PK)
- company_id (FK)
- payroll_month
- payroll_year
- generated_at
- total_amount
```

**AdvanceRequest / LeaveRequest**
```sql
- request_id (PK)
- worker_id (FK)
- company_id (FK)
- request_type (ADVANCE, LEAVE)
- status (PENDING, APPROVED, REJECTED)
- amount / days
- reason
- created_at
```

### 2.5 Authentication & Authorization Flow

#### JWT-Based Authentication

1. **Login Request**: User submits email/password via POST `/api/auth/login`
2. **Token Generation**: Backend validates credentials and generates JWT containing:
   - `userId`
   - `companyId` (tenant context)
   - `email`
   - `role` (ADMIN, WORKER)
3. **Token Storage**: Frontend stores JWT in localStorage
4. **Request Authorization**: Axios interceptor attaches JWT to all subsequent requests
5. **Token Validation**: `JwtAuthenticationFilter` validates token on each request
6. **Tenant Isolation**: TenantContext extracts `companyId` from token to filter queries

#### Security Considerations
- Passwords hashed using bcrypt
- JWT tokens include expiry (typically 24 hours)
- CORS configured for localhost development
- HTTP-only cookies recommended for production
- Tenant context prevents cross-company data access

---

## 3. Step-by-Step Development Roadmap

### Phase 1: Environment Setup & Architecture Design (Days 1-3)

**Objectives**
- Set up development environment
- Define domain models and relationships
- Design API contract specifications
- Establish project folder structure

**Key Deliverables**
- Maven project initialized with Spring Boot 3 dependencies
- MySQL database created with initial schema
- Frontend project scaffolded with Vite
- Package structure defined for backend layers
- API endpoint specification document

**Technical Decisions**
- Chose Spring Boot for its integrated ecosystem (security, data, web)
- Selected JWT over session-based auth for stateless, scalable design
- Implemented tenant isolation at the service layer using TenantContext
- Chose React Context API over Redux for simplicity (small state tree)
- Selected CSS Modules for scoped styling without additional dependencies

**Commands Executed**
```bash
# Backend
mvn archetype:generate -DgroupId=com.paystride -DartifactId=paystride-api -DarchetypeArtifactId=maven-archetype-quickstart
mvn spring-boot:run

# Frontend
npm create vite@latest paystride-frontend -- --template react
npm install
npm run dev
```

---

### Phase 2: Foundation & Core Schemas (Days 4-7)

**Objectives**
- Create JPA entity classes with relationships
- Set up Spring Data repositories
- Implement database connection and migrations
- Design data transfer objects (DTOs)

**Key Deliverables**
- Entity classes: Company, User, Worker, DailyHours, PayrollSummary, AdvanceRequest, LeaveRequest
- Repository interfaces with custom query methods
- Fluent builder patterns for entity creation
- Dto classes for API contracts
- Initial database schema with migrations

**Technical Implementation**

1. **Entity Design Pattern**
   ```java
   @Entity
   @Table(name = "companies")
   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   @Builder
   public class Company {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long companyId;
       
       @Column(nullable = false, unique = true)
       private String companyName;
       
       @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
       private List<User> users;
       
       @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
       private List<Worker> workers;
   }
   ```

2. **Repository Pattern**
   ```java
   public interface WorkerRepository extends JpaRepository<Worker, Long> {
       Optional<Worker> findByWorkerCodeAndCompanyId(String code, Long companyId);
       List<Worker> findByCompanyId(Long companyId);
   }
   ```

3. **DTO for API Contracts**
   ```java
   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public class WorkerResponseDTO {
       private Long workerId;
       private String workerCode;
       private String fullName;
       private String email;
       private BigDecimal salary;
   }
   ```

**Challenges Faced**
- **Issue**: Bidirectional relationship causing circular JSON serialization in REST responses
- **Solution**: Used `@JsonBackReference` on inverse side and created separate response DTOs to control serialization

---

### Phase 3: Authentication & Security Layer (Days 8-10)

**Objectives**
- Implement JWT token generation and validation
- Set up Spring Security configuration
- Create authentication controllers
- Build tenant context isolation

**Key Deliverables**
- `AuthController` with login and registration endpoints
- JWT utility class for token creation/validation
- Security filter for request inspection
- TenantContext for multi-tenancy
- Password encryption with bcrypt
- Global exception handler

**Technical Implementation**

1. **JWT Token Creation**
   ```java
   public String generateToken(User user) {
       Claims claims = Jwts.claims()
           .setSubject(user.getUserId().toString())
           .put("email", user.getEmail())
           .put("companyId", user.getCompany().getCompanyId())
           .put("role", user.getRole());
       
       return Jwts.builder()
           .setClaims(claims)
           .setIssuedAt(new Date())
           .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
           .signWith(SignatureAlgorithm.HS512, secretKey)
           .compact();
   }
   ```

2. **JWT Authentication Filter**
   ```java
   @Component
   public class JwtAuthenticationFilter extends OncePerRequestFilter {
       @Override
       protected void doFilterInternal(HttpServletRequest request, 
           HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
           String token = extractToken(request);
           if (token != null && jwtUtil.validateToken(token)) {
               Long companyId = jwtUtil.getCompanyIdFromToken(token);
               TenantContext.setCurrentTenant(companyId);
           }
           filterChain.doFilter(request, response);
       }
   }
   ```

3. **Tenant Context Implementation**
   ```java
   public class TenantContext {
       private static final ThreadLocal<Long> currentTenant = new ThreadLocal<>();
       
       public static void setCurrentTenant(Long companyId) {
           currentTenant.set(companyId);
       }
       
       public static Long getCurrentTenant() {
           return currentTenant.get();
       }
   }
   ```

**Security Architecture**
- Uses asymmetric JWT secrets (prefer RSA in production)
- Implements password hashing: bcrypt with strength 10
- Role-based access control (ADMIN, WORKER)
- CORS configuration for frontend cross-origin requests
- SQL injection prevention through parameterized queries via JPA

**Challenge Resolved**
- **Issue**: Worker authentication needed isolation from admin authentication
- **Solution**: Created separate `WorkerPortalController` with distinct authentication flow; both share JWT infrastructure but maintain logical separation

---

### Phase 4: API Implementation & Business Logic (Days 11-15)

**Objectives**
- Implement all REST endpoints
- Build core business logic in services
- Add payroll calculation engine
- Implement hour tracking and validation

**Key Deliverables**

1. **Admin API Endpoints**
   ```
   POST   /api/auth/register          - Company registration
   POST   /api/auth/login             - Admin login
   POST   /api/workers                - Create worker
   GET    /api/workers                - List workers
   PUT    /api/workers/{id}           - Update worker
   DELETE /api/workers/{id}           - Delete worker
   POST   /api/daily-hours            - Log hours
   GET    /api/payroll/generate       - Generate payroll
   GET    /api/dashboard/stats        - Dashboard analytics
   GET    /api/requests               - Review HR requests
   PUT    /api/requests/{id}/approve  - Approve request
   ```

2. **Worker API Endpoints**
   ```
   POST   /api/worker/login           - Worker authentication
   GET    /api/worker/attendance      - View hours
   GET    /api/worker/payslips        - List payslips
   POST   /api/worker/requests        - Submit advance/leave
   GET    /api/worker/requests        - View request status
   ```

**Payroll Calculation Engine**
```java
public class PayrollCalculator {
    public PayrollSummary calculateMonthlyPayroll(List<DailyHours> hours, 
                                                    Worker worker, 
                                                    int month, int year) {
        BigDecimal totalHours = hours.stream()
            .map(DailyHours::getHoursWorked)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal hourlyRate = worker.getSalary()
            .divide(new BigDecimal(160), 2, RoundingMode.HALF_UP); // 160 hours/month
        
        BigDecimal baseSalary = hourlyRate.multiply(totalHours);
        
        // Apply deductions
        BigDecimal finalSalary = applyDeductions(baseSalary, worker);
        
        return PayrollSummary.builder()
            .worker(worker)
            .company(worker.getCompany())
            .month(month)
            .year(year)
            .totalHours(totalHours)
            .totalAmount(finalSalary)
            .generatedAt(LocalDateTime.now())
            .build();
    }
}
```

**Service Layer Pattern**
```java
@Service
@Transactional
public class DailyHoursService {
    @Autowired
    private DailyHoursRepository hoursRepository;
    
    public DailyHours logHours(DailyHoursDTO dto) {
        Worker worker = workerRepository.findById(dto.getWorkerId())
            .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        
        // Validation
        if (dto.getHoursWorked().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Hours must be greater than 0");
        }
        if (dto.getHoursWorked().compareTo(new BigDecimal(24)) > 0) {
            throw new ValidationException("Hours cannot exceed 24");
        }
        
        DailyHours hours = DailyHours.builder()
            .worker(worker)
            .company(worker.getCompany())
            .workDate(dto.getWorkDate())
            .hoursWorked(dto.getHoursWorked())
            .status(HourStatus.PENDING)
            .build();
        
        return hoursRepository.save(hours);
    }
}
```

**Challenges Overcome**

1. **Challenge**: Prevent duplicate hour entries for same worker on same day
   ```java
   // Solution: Unique constraint
   @Table(uniqueConstraints = {
       @UniqueConstraint(columnNames = {"worker_id", "work_date", "company_id"})
   })
   public class DailyHours { ... }
   ```

2. **Challenge**: Efficient payroll generation for large datasets
   ```java
   // Solution: Batch processing
   public void generatePayrollBatch(Long companyId, int month, int year) {
       List<Worker> workers = workerRepository.findByCompanyId(companyId);
       workers.parallelStream()
           .forEach(worker -> generatePayrollForWorker(worker, month, year));
   }
   ```

---

### Phase 5: Frontend Integration & UI Development (Days 16-20)

**Objectives**
- Build responsive UI components
- Implement authentication flows
- Connect frontend to backend APIs
- Add data validation and error handling
- Enable PDF payslip generation

**Key Deliverables**

1. **Authentication Flow**
   - Login page with form validation
   - Registration page for company setup
   - Protected route wrapper
   - logout and session management

2. **Admin Dashboard**
   - Worker list with CRUD operations
   - Hour logging interface
   - Payroll generation and preview
   - HR request management dashboard
   - Analytics visualization

3. **Worker Portal**
   - Attendance history view
   - Payslip download (PDF)
   - Leave/advance request forms
   - Request status tracking

**Axios API Client Pattern**
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

**PDF Generation Implementation**
```javascript
// src/utils/pdfUtils.js
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generatePayslipPDF = (payroll, worker) => {
    const doc = new jsPDF();
    
    doc.text('PAYSLIP', 20, 10);
    doc.text(`Worker: ${worker.fullName}`, 20, 30);
    doc.text(`Period: ${payroll.month}/${payroll.year}`, 20, 40);
    
    autoTable(doc, {
        head: [['Description', 'Amount']],
        body: [
            ['Basic Salary', formatCurrency(payroll.basicSalary)],
            ['Deductions', formatCurrency(payroll.deductions)],
            ['Net Amount', formatCurrency(payroll.totalAmount)]
        ],
        startY: 50
    });
    
    doc.save(`payslip_${worker.workerId}_${payroll.month}_${payroll.year}.pdf`);
};
```

**Challenge: Nested JSON Serialization**
```javascript
// Problem: API response includes full related objects causing large payloads
// Solution: Use DTOs that flatten hierarchy
{
  "workerId": 1,
  "name": "John Doe", 
  "companyName": "ACME Corp"  // Flatten instead of { "company": { "companyName": ... } }
}
```

---

### Phase 6: Testing & Refinement (Days 21+)

**Objectives**
- Write unit and integration tests
- Optimize database queries
- Add API documentation
- Conduct security review
- Prepare for deployment

**Testing Strategy**

1. **Backend Unit Tests**
   ```java
   @SpringBootTest
   public class PayrollCalculatorTest {
       @Test
       public void testCalculateMonthlyPayroll() {
           Worker worker = createTestWorker(BigDecimal.valueOf(30000));
           List<DailyHours> hours = createTestHours(20); // 20 days
           
           PayrollSummary payroll = calculator.calculateMonthlyPayroll(
               hours, worker, 4, 2026);
           
           assertEquals(BigDecimal.valueOf(37500), payroll.getTotalAmount());
       }
   }
   ```

2. **Integration Tests**
   ```java
   @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
   public class WorkerControllerTest {
       @Test
       public void testCreateWorker() throws Exception {
           WorkerDTO dto = new WorkerDTO("EMP001", "John", "john@email.com");
           
           mockMvc.perform(post("/api/workers")
               .header("Authorization", "Bearer " + token)
               .contentType(MediaType.APPLICATION_JSON)
               .content(objectMapper.writeValueAsString(dto)))
               .andExpect(status().isCreated());
       }
   }
   ```

**Performance Optimizations**
- Database query indexing on `company_id`, `worker_id`, `work_date`
- Lazy loading strategies for relationships
- Query result pagination for large datasets
- API response caching where appropriate

---

## 4. Key Technical Challenges & Solutions

### Challenge 1: Multi-Tenant Data Isolation

**Problem**
When scaling to multiple companies, ensuring that a user from Company A cannot access Company B's worker data becomes critical. Initial approach of checking `companyId` in every service method is error-prone and verbose.

**Technical Depth**
- Companies share same database but must have zero cross-company visibility
- Risk: A forgotten check in one service method exposes all data
- Performance: Filtering at application level is less efficient than database level

**Solution: TenantContext with AOP**
```java
@Aspect
@Component
public class TenantAspect {
    @Around("@annotation(TenantSecured)")
    public Object secureTenantAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        Long currentTenant = TenantContext.getCurrentTenant();
        if (currentTenant == null) {
            throw new AuthorizationException("Tenant context not set");
        }
        
        Object[] args = joinPoint.getArgs();
        // Inject tenant context into method arguments
        
        return joinPoint.proceed(args);
    }
}

@Service
public class WorkerService {
    @TenantSecured
    public List<Worker> getCompanyWorkers(Long companyId) {
        return workerRepository.findByCompanyId(
            TenantContext.getCurrentTenant()
        );
    }
}
```

**Benefits**
- Single point of tenant enforcement via annotation
- Consistent isolation across all service methods
- Cleaner code without repetitive checks
- Audit trail of tenant-aware operations

---

### Challenge 2: Payroll Calculation with Multiple Deductions

**Problem**
Calculating gross to net salary involves:
- Variable hours (workers work different daily hours)
- Multiple deduction types (tax, insurance, advances taken)
- Rounding precision for currency calculations
- Historical accuracy (cannot retroactively change calculation logic)

**Calculation Complexity**
```
Gross = Hourly Rate × Hours Worked
Tax = Gross × Tax Rate
Insurance = Fixed Amount per Month
Advance Taken = Sum of approved advances in month
Net = Gross - Tax - Insurance - Advance Taken
```

**Solution: Strategy Pattern with Immutable Records**
```java
public interface DeductionStrategy {
    BigDecimal calculate(PayrollContext context);
}

public class TaxDeductionStrategy implements DeductionStrategy {
    private static final BigDecimal TAX_RATE = BigDecimal.valueOf(0.12);
    
    @Override
    public BigDecimal calculate(PayrollContext context) {
        return context.getGrossSalary()
            .multiply(TAX_RATE)
            .setScale(2, RoundingMode.HALF_UP);
    }
}

@Service
public class PayrollService {
    private List<DeductionStrategy> strategies = List.of(
        new TaxDeductionStrategy(),
        new InsuranceDeductionStrategy(),
        new AdvanceDeductionStrategy()
    );
    
    public PayrollSummary generatePayroll(Worker worker, int month, int year) {
        BigDecimal grossSalary = calculateGross(worker, month, year);
        
        PayrollContext context = new PayrollContext(worker, grossSalary, month, year);
        BigDecimal totalDeductions = strategies.stream()
            .map(s -> s.calculate(context))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal netSalary = grossSalary.subtract(totalDeductions);
        
        return PayrollSummary.builder()
            .worker(worker)
            .month(month)
            .year(year)
            .grossSalary(grossSalary)
            .totalDeductions(totalDeductions)
            .netSalary(netSalary)
            .calculationVersion(CURRENT_VERSION) // For historical accuracy
            .build();
    }
}
```

**Why This Approach**
- Each deduction type is independent and testable
- Adding new deduction types requires only a new strategy implementation
- Calculation version ensures payroll integrity if logic changes
- BigDecimal with explicit rounding prevents floating-point errors

**Testing**
```java
@Test
public void testPayrollWithMultipleDeductions() {
    Worker worker = createWorker(BigDecimal.valueOf(30000));
    List<DailyHours> hours = createHours(20, 8); // 20 days, 8 hrs each
    createAdvanceRequest(worker, 5000); // Advance taken
    
    PayrollSummary payroll = payrollService.generatePayroll(worker, 4, 2026);
    
    // Verify: 30000 base - tax(3600) - insurance(500) - advance(5000) = 20900
    assertEquals(BigDecimal.valueOf(20900), payroll.getNetSalary());
}
```

---

### Challenge 3: JWT Token Management & Password Reset Flow

**Problem**
- Users can forget passwords and need secure password reset
- Standard JWT approach doesn't handle logout well (tokens valid until expiry)
- Reset tokens must be single-use with time expiration
- Frontend must handle token refresh without interrupting user experience

**Token Lifecycle Issues**
1. User logs in → receives JWT valid for 24 hours
2. User changes password → old JWT still valid until expiry (security risk)
3. User logs out → token still usable if captured (no blacklist)
4. User forgets password → needs time-limited reset link

**Solution: Hybrid Token Approach**

```java
// Access token: short-lived, used for API requests
@Data
public class JwtResponse {
    private String accessToken;        // 15 minutes
    private String refreshToken;       // 7 days
    private Long expiresIn;            // milliseconds
}

@Service
public class JwtTokenProvider {
    public String generateAccessToken(User user) {
        return Jwts.builder()
            .setSubject(user.getUserId().toString())
            .claim("type", "ACCESS")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
            .signWith(SignatureAlgorithm.HS512, accessKey)
            .compact();
    }
    
    public String generateRefreshToken(User user) {
        return Jwts.builder()
            .setSubject(user.getUserId().toString())
            .claim("type", "REFRESH")
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
            .signWith(SignatureAlgorithm.HS512, refreshKey)
            .compact();
    }
    
    // Token blacklist for logout
    public void blacklistToken(String token) {
        Long expiryTime = getTokenExpiry(token);
        redisTemplate.opsForValue()
            .set("blacklist:" + token, "true", expiryTime, TimeUnit.MILLISECONDS);
    }
}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody ResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Generate single-use reset token (valid for 1 hour)
        String resetToken = UUID.randomUUID().toString();
        redisTemplate.opsForValue()
            .set("reset:" + resetToken, user.getUserId().toString(), 1, TimeUnit.HOURS);
        
        // In production: send reset link via email
        // emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        
        return ResponseEntity.ok("Reset link sent to email");
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String userId = redisTemplate.opsForValue()
            .get("reset:" + request.getResetToken());
        
        if (userId == null) {
            throw new BusinessException("Reset token expired or invalid");
        }
        
        User user = userRepository.findById(Long.valueOf(userId))
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Invalidate token after use
        redisTemplate.delete("reset:" + request.getResetToken());
        
        return ResponseEntity.ok("Password reset successfully");
    }
}
```

**Frontend Token Management**
```javascript
// src/services/api.js
let refreshPromise = null;

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            if (!refreshPromise) {
                refreshPromise = api.post('/auth/refresh', {
                    refreshToken: localStorage.getItem('refreshToken')
                })
                .then(res => {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    return res.data.accessToken;
                })
                .catch(err => {
                    localStorage.clear();
                    window.location.href = '/login';
                    throw err;
                })
                .finally(() => {
                    refreshPromise = null;
                });
            }
            
            const newToken = await refreshPromise;
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api(error.config);
        }
        return Promise.reject(error);
    }
);
```

**Benefits of This Approach**
- Short-lived access tokens minimize exposure if token is compromised
- Refresh tokens allow seamless user experience without re-login
- Single-use reset tokens prevent brute force attacks
- Blacklist mechanism enables immediate logout across all sessions
- Clear separation of concerns (access vs refresh vs reset)

---

## 5. Known Technical Debt & Future Improvements

### Current Limitations
1. **Secrets Management**: API keys and DB credentials in application.properties → move to environment variables
2. **Test Coverage**: ~30% → target 80% for critical business logic
3. **Caching**: No caching layer → implement Redis for frequently accessed data
4. **Database Migrations**: Manual → implement Flyway/Liquibase
5. **Logging**: Basic → add structured logging (ELK stack)
6. **Monitoring**: No observability → add Prometheus metrics
7. **Documentation**: Limited API docs → add OpenAPI/Swagger

### Recommended Future Work
- Implement role-based access control (RBAC) matrix
- Add audit logging for financial transactions
- Implement file storage for payslip archives (AWS S3)
- Add batch import for worker creation
- Implement advanced scheduling for payroll generation
- Add email notifications for leave/advance approvals
- Create mobile app for worker self-service

---

## 6. Deployment Architecture (Future)

```text
┌─────────────────────────────────────────────────┐
│         AWS/Cloud Infrastructure                 │
├──────────────────┬──────────────────────────────┤
│   CloudFront CDN │ S3 Static Website Hosting    │
│   (React Build)  │ (Frontend Assets)             │
└────────┬─────────┴──────────────┬────────────────┘
         │                        │
         └─────────────┬──────────┘
                       │
         ┌─────────────v──────────────┐
         │   API Gateway / ALB         │
         │  (Load Balancing)           │
         └──────────────┬──────────────┘
                        │
         ┌──────────────v──────────────┐
         │  ECS / K8s Cluster          │
         │  (Spring Boot Services)     │
         │  - Auto-scaling             │
         │  - Health checks            │
         └──────────────┬──────────────┘
                        │
         ┌──────────────v──────────────┐
         │  RDS MySQL (Primary)        │
         │  - Automated backups        │
         │  - Read replicas            │
         └─────────────────────────────┘
```

---

## Summary

PayStride demonstrates a complete proficiency in:
- **Full-stack architecture**: multitier design with clear separation of concerns
- **Spring Boot mastery**: security, data access, API design
- **Frontend engineering**: React patterns, state management, PDF generation
- **Security implementation**: JWT tokens, multi-tenancy, data isolation
- **Problem-solving**: complex business logic (payroll), scalability challenges, error handling
- **Software craftsmanship**: layered architecture, design patterns, testing strategies

The engineering decisions reflect both pragmatic choices for a startup product and industry best practices for long-term maintainability.

## Documentation Goal

This architecture note is intentionally short. It is meant to help reviewers, teammates, and GitHub visitors understand the project quickly without overselling it.
