# FIGMA CHANGE REQUEST
## Authentication & Access Control Simplification
### Version 2.2 – Three User Types Only

---

# OBJECTIVE

Simplify user access and permissions across the Island Hopping Reflection & Action Planning Platform.

Remove the Viewer and Team Lead roles and implement only three user types:

1. Super Admin
2. Admin
3. Team (Contributors)

This model reduces complexity while maintaining data security and accountability.

---

# USER TYPES

## SUPER ADMIN

### Purpose

Full system ownership and administration.

### Permissions

✅ Manage users

✅ Manage teams

✅ Create workshops

✅ Open workshops

✅ Close workshops

✅ Archive workshops

✅ Manage outcome statements

✅ Manage system settings

✅ View all data

✅ Edit all data

✅ Export all reports

✅ View analytics

✅ Configure dashboards

✅ Manage permissions

---

## ADMIN

### Purpose

Workshop facilitators and platform coordinators.

### Permissions

✅ View all team submissions

✅ View all dashboards

✅ Create workshop sessions

✅ Open and close sessions

✅ Review submissions

✅ Moderate discussions

✅ Generate reports

✅ Export outputs

✅ Monitor completion status

✅ Send reminders and notifications

---

### Restrictions

❌ Cannot change system settings

❌ Cannot manage platform permissions

❌ Cannot manage user access

❌ Cannot delete workshops

---

## TEAM (CONTRIBUTORS)

### Purpose

Participate in reflection and action planning activities.

### Permissions

✅ Create reflections

✅ Edit reflections

✅ Create actions

✅ Update actions

✅ Update progress mapping

✅ Participate in discussions

✅ View organisation-wide dashboards

✅ View workshop progress

✅ Export team results

---

### Restrictions

Teams can only edit their own records.

Teams cannot modify information belonging to another team.

---

# LOGIN MODEL

Each EQAP team will have a single login account.

Example:

```text
curriculum@islandhopping.local
lsa@islandhopping.local
qualifications@islandhopping.local
cool@islandhopping.local
```

Each login represents the entire team rather than an individual user.

---

# LANDING PAGE

## Page Name

```text
Welcome to the Island Hopping Journey
```

This becomes the default homepage.

---

# LANDING PAGE LAYOUT

```text
┌───────────────────────────────────────────────┐
│                                               │
│          ISLAND HOPPING JOURNEY               │
│                                               │
│   Reflection, Learning and Action Planning    │
│                                               │
│ Select how you would like to enter            │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│        👥 TEAM ACCESS                         │
│                                               │
│ Participate in the workshop                   │
│ Add reflections and action plans              │
│                                               │
│            [ TEAM LOGIN ]                     │
│                                               │
├───────────────────────────────────────────────┤
│                                               │
│        🛠 ADMIN ACCESS                        │
│                                               │
│ Facilitate, monitor and manage workshops      │
│                                               │
│            [ ADMIN LOGIN ]                    │
│                                               │
└───────────────────────────────────────────────┘
```

---

# AUTHENTICATION FLOW

## TEAM ACCESS

```text
Landing Page
      ↓
Team Login
      ↓
Team Dashboard
      ↓
Workshop Journey
```

---

## ADMIN ACCESS

```text
Landing Page
      ↓
Admin Login
      ↓
Admin Dashboard
      ↓
Workshop Management
```

---

## SUPER ADMIN ACCESS

```text
Landing Page
      ↓
Admin Login
      ↓
System Administration Panel
```

---

# TEAM DASHBOARD

Upon login the system automatically identifies the team account.

Example:

```text
Logged In As

Qualifications Team
```

---

# TEAM DASHBOARD FEATURES

Display:

- Team Progress Score
- Team Stagnation Score
- Current Workshop
- Reflection Completion Status
- STOP Themes
- START Themes
- CONTINUE Themes
- Team Outcome Statements
- Team Action Plans
- Action Completion Rate

---

# ORGANISATIONAL DASHBOARD

All Teams can view but not edit.

Visible:

```text
Overall Progress Map
Cross-Team Themes
Workshop Statistics
Completion Rates
Outcome Performance
Heat Maps
Learning Insights
```

---

# TEAM DATA RESTRICTIONS

Every team can:

✅ View all dashboard summaries

✅ View organisation-wide results

✅ View aggregate themes

---

Every team cannot:

❌ Edit another team's reflections

❌ Edit another team's actions

❌ Edit another team's progress mapping

❌ Modify another team's outcome statements

❌ Delete another team's records

---

# ROW LEVEL SECURITY (RLS)

All editable records must be secured using team ownership.

Policy:

```sql
team_id = current_user.team_id
```

Applied to:

- reflections
- action_plans
- progress_mapping
- comments
- attachments

---

# DATABASE UPDATE

## TEAM ACCOUNTS

```sql
team_accounts
```

Fields:

```sql
id UUID
team_id UUID
email TEXT
password_hash TEXT
status TEXT
created_at TIMESTAMP
```

---

## USER ROLES

```sql
role
```

Allowed Values:

```text
SUPER_ADMIN
ADMIN
TEAM
```

---

# DASHBOARD HEADER

Display logged in status.

Example:

```text
Logged in as:
👥 Qualifications Team
```

or

```text
Logged in as:
🛠 Admin
```

or

```text
Logged in as:
⚙ Super Admin
```

---

# FIGMA SCREENS TO CREATE

### 1. Landing Page

Access Selection

---

### 2. Team Login Page

Team Authentication

---

### 3. Team Dashboard

Workshop Contributions

---

### 4. Admin Dashboard

Workshop Management

---

### 5. Super Admin Dashboard

Platform Administration

---

# USER EXPERIENCE PRINCIPLE

The platform should remain simple:

SUPER ADMIN
↓
Manage the platform

ADMIN
↓
Manage and facilitate workshops

TEAM
↓
Contribute reflections, actions and progress updates

Teams have ownership of their own data while maintaining visibility of organisation-wide progress, learning and results.