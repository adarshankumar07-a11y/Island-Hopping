# Island Hopping Reflection & Action Planning Platform
## Full Application Development Prompt (Figma + Supabase + Admin Dashboard)

### Project Overview

Design and develop a modern web-based reflection and action-planning platform based on the **Island Hopping Journey Framework**.

The platform will enable EQAP teams to participate in structured reflection exercises, map their progress versus stagnation, identify improvement opportunities, and develop action plans aligned to their team outcome areas.

The solution should include:

- Interactive workshop interface
- Team collaboration features
- Administrative dashboard
- Role-based access control
- Supabase backend
- Real-time collaboration
- Analytics and reporting
- Export functionality

---

# Core Concept

The platform uses an island-hopping metaphor consisting of four reflection stages:

```text
🏝️ WHAT ISLAND
      ↓
🏝️ HOW ISLAND
      ↓
🏝️ SO WHAT ISLE
      ↓
🏝️ NOW WHAT CAY
```

Teams move through each island sequentially, contributing responses using the STOP, START and CONTINUE framework.

---

# Participating Teams

Configure the following teams:

1. Curriculum and Assessment Team
2. Large Scale Assessment Team
3. Policy and Research Team
4. Qualifications Team
5. Corporate Team
6. Data and EMIS Team
7. IT Team
8. COOL Team

---

# User Roles

## Super Admin

Permissions:

- Manage users
- Manage teams
- Create workshops
- Edit workshops
- Close workshops
- Access all reports
- Manage outcome areas
- System settings

---

## Facilitator

Permissions:

- Create workshop sessions
- Open and close sessions
- Review submissions
- Export reports
- View team analytics
- Moderate discussions

---

## Team Lead

Permissions:

- View team submissions
- Edit team submissions
- Manage action plans
- Monitor progress
- Update action statuses

---

## Team Member

Permissions:

- Participate in workshops
- Add reflections
- Create action items
- View team outputs

---

## Viewer

Permissions:

- Read-only access
- View reports and dashboards

---

# Reflection Workflow

Each island should contain three sections:

## STOP

Questions:

- What should we stop doing?
- What activities slow us down?
- What processes are no longer adding value?
- What bottlenecks exist?
- What duplication or confusion should be removed?

---

## START

Questions:

- What should we start doing?
- What opportunities are we currently missing?
- What improvements should we introduce?
- What tools or technologies should we try?
- What innovation should be explored?

---

## CONTINUE

Questions:

- What is currently working well?
- What strengths should we maintain?
- What behaviours contribute to success?
- What processes consistently deliver value?
- What successful practices should be scaled?

---

# Island Structure

---

## WHAT ISLAND

### Purpose

Understand current reality.

Questions:

- Where are we now?
- What progress have we made?
- What barriers exist?
- What strengths exist?

---

## HOW ISLAND

### Purpose

Explore contributing factors.

Questions:

- How did we get here?
- What behaviours influence performance?
- Which systems support or hinder outcomes?
- What factors influence success?

---

## SO WHAT ISLE

### Purpose

Determine impact and meaning.

Questions:

- What are the implications?
- What risks exist?
- What opportunities exist?
- What does this mean for our outcomes?

---

## NOW WHAT CAY

### Purpose

Transform insights into actions.

Questions:

- What must we stop?
- What must we start?
- What must continue?
- What commitments will we make?

---

# Progress vs Stagnation Mapping

Create an interactive matrix.

```text
HIGH PROGRESS
⬆
│
│
│
│
│
└────────────────────────►
     HIGH STAGNATION
```

Teams should drag a team marker to indicate their current position.

Store coordinates in the database.

Enable historical comparison between workshops.

---

# Team Action Planning Module

## Action Register

| Action Type | Action | Team Outcome Area | Progress Impact | Timeline | Success Indicator | Status |
|------------|----------|------------------|----------------|----------|------------------|--------|
| STOP | | | | | | |
| START | | | | | | |
| CONTINUE | | | | | | |

---

# Team Outcome Areas

Administrators must be able to configure custom outcome areas.

Example outcome areas:

- Curriculum Development
- Assessment Delivery
- Research and Evidence
- Qualifications Services
- Stakeholder Engagement
- Data Governance
- ICT Service Delivery
- Learning Innovation
- Monitoring and Evaluation
- Customer Service Excellence

---

# Progress Impact Categories

Use colour coding:

## 🔴 Removes Stagnation

Actions that eliminate barriers.

---

## 🟡 Improves Efficiency

Actions that streamline delivery.

---

## 🟢 Accelerates Outcomes

Actions directly improving achievement.

---

## 🔵 Builds Future Capability

Actions strengthening future performance.

---

# Dashboard Analytics

## Team Dashboard

Display:

- Total reflections submitted
- STOP themes
- START themes
- CONTINUE themes
- Outcome area analysis
- Progress score
- Action completion rates

---

## Executive Dashboard

Display:

- Cross-team themes
- Common bottlenecks
- Emerging opportunities
- Progress heat map
- Outcome area performance
- Workshop comparison reports

---

# Reporting

Generate:

## PDF Reports

Include:

- Workshop summary
- Team summaries
- Action plans
- Progress mapping
- Recommendations

---

## Excel Export

Include:

- Reflections
- Actions
- Teams
- Outcome areas
- Analytics

---

# Real-Time Collaboration

Enable:

- Live updates
- Presence indicators
- Collaborator cursors
- Real-time sticky notes
- Real-time action planning

---

# Notifications

Send notifications when:

- Workshop opens
- Workshop closes
- Action assigned
- Action due
- Action completed

---

# Supabase Backend

Use Supabase for:

- Authentication
- Database
- Realtime
- Row Level Security
- Storage

---

# Required Database Tables

## teams

```sql
id
name
colour
created_at
```

---

## users

```sql
id
name
email
role
team_id
created_at
```

---

## workshop_sessions

```sql
id
title
description
status
start_date
end_date
created_by
created_at
```

---

## islands

```sql
id
name
sequence
```

Values:

- What Island
- How Island
- So What Isle
- Now What Cay

---

## team_outcome_areas

```sql
id
team_id
name
description
created_at
```

---

## reflections

```sql
id
session_id
team_id
island_id
reflection_type
content
created_by
created_at
```

reflection_type:

- STOP
- START
- CONTINUE

---

## action_plans

```sql
id
session_id
team_id
action_type
action
team_outcome_area_id
progress_impact
timeline
success_indicator
status
created_by
created_at
```

---

## progress_mapping

```sql
id
session_id
team_id
progress_score
stagnation_score
comments
created_at
```

---

# Frontend Technology Stack

```text
Next.js 15
React
TypeScript
TailwindCSS
ShadCN UI
Framer Motion
React Query
React Hook Form
Zod
```

---

# Backend Technology Stack

```text
Supabase Auth
Supabase PostgreSQL
Supabase Storage
Supabase Realtime
Supabase Row Level Security
```

---

# Design Requirements

Use:

- Ocean-themed interface
- Island illustrations
- Dotted navigation routes
- Modern EQAP-inspired colour palette
- Responsive design
- Accessibility compliant layout
- Mobile-friendly interface

---

# Success Criteria

The solution should enable teams to:

- Reflect effectively on performance
- Identify progress and stagnation patterns
- Align actions with team outcome areas
- Track improvement over time
- Generate evidence-based action plans
- Support organisational learning and accountability

The platform should provide a clear visual journey from reflection to action while giving leadership visibility into organisational progress across all teams.