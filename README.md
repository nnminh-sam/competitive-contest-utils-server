# Contest Registration System

A backend system for managing competitive programming contests, including contestant registration (individual and team), contest management, and affiliation (school/organization) tracking. Built with [NestJS](https://nestjs.com/), PostgreSQL, and Redis.

## Features

- User authentication and role-based access (contestant, admin, etc.)
- Contest creation and management (single/team contests)
- Contestant registration (individual/team)
- Team management
- Affiliation (school/organization) management
- Participation tracking
- RESTful API with Swagger documentation
- Email notifications (via mailing module)
- Robust validation, error handling, and API response formatting

## Database Schema

### 1. `affiliation` (Đơn vị/Trường học)

| STT | Tên thuộc tính | Ràng buộc               | Kiểu dữ liệu | Ý nghĩa                                   |
|-----|----------------|-------------------------|--------------|-------------------------------------------|
| 1   | id             | PK                      | uuid         | Khóa chính, định danh duy nhất cho đơn vị |
| 2   | name           | NOT NULL, UNIQUE        | varchar      | Tên đơn vị/trường học                     |
| 3   | createdAt      | NOT NULL, DEFAULT now() | timestamp    | Thời điểm tạo bản ghi                     |
| 4   | updatedAt      | NOT NULL, DEFAULT now() | timestamp    | Thời điểm cập nhật bản ghi gần nhất       |

### 2. `contest` (Cuộc thi)

| STT | Tên thuộc tính | Ràng buộc                  | Kiểu dữ liệu | Ý nghĩa                                          |
|-----|----------------|----------------------------|--------------|--------------------------------------------------|
| 1   | id             | PK                         | uuid         | Khóa chính, định danh duy nhất cho cuộc thi      |
| 2   | name           | NOT NULL, UNIQUE           | varchar      | Tên viết tắt của cuộc thi                        |
| 3   | formalName     | NOT NULL                   | varchar      | Tên đầy đủ chính thức của cuộc thi               |
| 4   | description    | NOT NULL                   | varchar      | Mô tả chi tiết về cuộc thi                       |
| 5   | banner         | NOT NULL                   | varchar      | Đường dẫn đến hình ảnh banner của cuộc thi       |
| 6   | startAt        | NOT NULL                   | timestamp    | Thời điểm bắt đầu cuộc thi                       |
| 7   | duration       | NOT NULL                   | integer      | Thời lượng cuộc thi (tính bằng phút)             |
| 8   | type           | NOT NULL, DEFAULT 'SINGLE' | varchar      | Loại cuộc thi (mặc định là SINGLE - thi cá nhân) |
| 9   | createdAt      | NOT NULL, DEFAULT now()    | timestamp    | Thời điểm tạo bản ghi                            |
| 10  | updatedAt      | NOT NULL, DEFAULT now()    | timestamp    | Thời điểm cập nhật bản ghi gần nhất              |

### 3. `contestants` (Thí sinh)

| STT | Tên thuộc tính | Ràng buộc                 | Kiểu dữ liệu | Ý nghĩa                                     |
|-----|----------------|---------------------------|--------------|---------------------------------------------|
| 1   | id             | PK                        | uuid         | Khóa chính, định danh duy nhất cho thí sinh |
| 2   | email          | NOT NULL, UNIQUE          | varchar      | Email của thí sinh                          |
| 3   | username       | NOT NULL, UNIQUE          | varchar      | Tên đăng nhập của thí sinh                  |
| 4   | password       | NOT NULL                  | varchar      | Mật khẩu đã được mã hóa                     |
| 5   | firstName      | NOT NULL                  | varchar      | Tên của thí sinh                            |
| 6   | lastName       | NOT NULL                  | varchar      | Họ của thí sinh                             |
| 7   | studentId      | NOT NULL, UNIQUE          | varchar      | Mã số sinh viên                             |
| 8   | gender         | NOT NULL, DEFAULT 'Other' | varchar      | Giới tính của thí sinh                      |
| 9   | availability   | NOT NULL, DEFAULT true    | boolean      | Trạng thái sẵn sàng tham gia                |
| 10  | teamId         | FK                        | uuid         | Khóa ngoại liên kết đến bảng team           |
| 11  | affiliationId  | NOT NULL, FK              | uuid         | Khóa ngoại liên kết đến bảng affiliation    |
| 12  | role           | DEFAULT 0                 | integer      | Vai trò của thí sinh trong hệ thống         |
| 13  | createdAt      | NOT NULL, DEFAULT now()   | timestamp    | Thời điểm tạo bản ghi                       |
| 14  | updatedAt      | NOT NULL, DEFAULT now()   | timestamp    | Thời điểm cập nhật bản ghi gần nhất         |

### 4. `team` (Đội thi)

| STT | Tên thuộc tính | Ràng buộc               | Kiểu dữ liệu | Ý nghĩa                                    |
|-----|----------------|-------------------------|--------------|--------------------------------------------|
| 1   | id             | PK                      | uuid         | Khóa chính, định danh duy nhất cho đội thi |
| 2   | name           | NOT NULL, UNIQUE        | varchar      | Tên đội thi                                |
| 3   | description    | NOT NULL                | varchar      | Mô tả về đội thi                           |
| 4   | createdAt      | NOT NULL, DEFAULT now() | timestamp    | Thời điểm tạo bản ghi                      |
| 5   | updatedAt      | NOT NULL, DEFAULT now() | timestamp    | Thời điểm cập nhật bản ghi gần nhất        |

### 5. `contest_participations` (Tham gia cuộc thi)

| STT | Tên thuộc tính | Ràng buộc               | Kiểu dữ liệu | Ý nghĩa                                                |
|-----|----------------|-------------------------|--------------|--------------------------------------------------------|
| 1   | contestId      | PK, FK                  | uuid         | Khóa chính và khóa ngoại liên kết đến bảng contest     |
| 2   | contestantId   | PK, FK                  | uuid         | Khóa chính và khóa ngoại liên kết đến bảng contestants |
| 3   | createdAt      | NOT NULL, DEFAULT now() | timestamp    | Thời điểm đăng ký tham gia cuộc thi                    |

**Lưu ý:**
- PK: Primary Key (Khóa chính)
- FK: Foreign Key (Khóa ngoại)
- Các ràng buộc ON DELETE và ON UPDATE được định nghĩa trong các khóa ngoại:
  - `contest_participations`: ON DELETE CASCADE (xóa bản ghi khi bảng cha bị xóa)
  - `contestants`: ON DELETE SET NULL cho teamId (set null khi team bị xóa) và ON DELETE NO ACTION cho affiliationId (không cho phép xóa nếu còn thí sinh)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for running PostgreSQL and Redis)

### Environment Variables

Create a `.env` file in the project root with the following variables (example):

```
POSTGRES_DB=contestdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

REDIS_BLACKLIST_PORT=6379
```

### Running with Docker (Recommended)

1. **Start PostgreSQL and Redis:**

   ```bash
   docker-compose up -d
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Run the backend in development mode:**

   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```

### Running Locally (Without Docker)

If you already have PostgreSQL and Redis running locally, configure your `.env` accordingly and skip the `docker-compose up` step.

### Build and Run in Production

```bash
yarn build
yarn start:prod
# or
npm run build
npm run start:prod
```

### API Documentation

Once the server is running, access the Swagger UI at:  
`http://localhost:<PORT>/api-document`

## Project Structure

- `src/modules/` — Main business logic (auth, contest, contestant, team, affiliation, mailing, admin)
- `src/models/` — ORM models/entities
- `src/common/` — Common utilities (decorators, guards, interceptors, pipes, DTOs)
- `scripts/database/` — SQL scripts for database setup

## License

This project is UNLICENSED. See the [LICENSE](./LICENSE) file for details (if present).

---

Would you like this README to be saved to your project? If you want to add or change any section, let me know!