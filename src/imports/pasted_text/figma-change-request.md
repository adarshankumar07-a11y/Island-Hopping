
# FIGMA CHANGE REQUEST
## Island Hopping Reflection & Action Planning Platform
### Version 2.0 – Outcome-Based Action Planning Enhancement

---

# OBJECTIVE

Update the Action Planning Module to replace generic "Outcome Areas" with EQAP-approved Team Outcome Statements.

The platform should ensure all STOP, START and CONTINUE actions are directly aligned to approved team outcomes, improving accountability, reporting, tracking and strategic alignment.

---

# DESIGN CHANGES

## EXISTING ACTION REGISTER

| Action Type | Action | Outcome Area | Progress Impact | Timeline | Success Indicator | Status |
|------------|----------|-------------|----------------|----------|------------------|--------|

---

## NEW ACTION REGISTER

| Action Type | Action | Team | Team Outcome Statement | Progress Impact | Owner | Timeline | Success Indicator | Status |
|------------|----------|------|------------------------|----------------|--------|----------|------------------|--------|

---

# USER INTERACTION FLOW

## Step 1

Select Team

Example:

```text
▼ Curriculum and Assessment Team
```

---

## Step 2

Populate Team Outcome Statement Dropdown

The Team Outcome Statement field must automatically display only the outcome statements associated with the selected team.

Component Type:

```text
Searchable Dropdown
```

Features:

- Dynamic filtering
- Search function
- Multi-line display
- Mobile responsive
- Tooltip support
- Accessible design

---

# NEW COMPONENT

## Component Name

```text
OutcomeStatementSelector
```

Component Type:

```text
Searchable Dropdown
```

States:

- Default
- Hover
- Selected
- Disabled
- Error

---

# TEAM OUTCOME STATEMENT LIBRARY

---

## CURRICULUM & ASSESSMENT TEAM

```text
Strengthened SPFSC assessment and national examination systems to ensure students completing Years 12 and 13 attain recognised qualifications that enable progression to further education, tertiary pathways, or employment.

Improved learning outcomes through the development and implementation of a quality curriculum aligned to country priorities and aspirations.

Support provided to PICs to contextualise regional teacher standards into the national frameworks, including the development of appraisal tools, strengthening readiness for validation and implementation to improve teacher quality.

Enhanced teaching quality and classroom practice through accessible, high-quality Ocean Literacy resources aligned to learning outcomes and integrating Pacific knowledge and contexts.
```

---

## LARGE SCALE ASSESSMENT TEAM

```text
Strengthened the use of PILNA reports and trend data to inform interventions, enhance ministry capacity, and support evidence-based planning, policy, and classroom practices.

Strengthened implementation of PALS through effective field trial administration.

Strengthened readiness and use of PILNA findings through effective preparation and dissemination of reports.
```

---

## QUALIFICATIONS TEAM

```text
Strengthened national and regional qualifications systems.

Enhance trust, understanding and ownership of the PQF as a regional framework.

Improved access to quality and industry relevant training packages for learners.

Strengthened credibility of qualifications and training providers.

Increased access to learning and employment opportunities.
```

---

## POLICY & RESEARCH TEAM

```text
Strengthened MOE capacity to develop and review policies.

Evidence-based insights on student performance to inform targeted interventions and policy improvements.

Strengthened national and regional capacity to generate, interpret and use education research and evidence to inform policy, planning and practice.

Improved measurement of Pacific students’ literacy and numeracy achievement.

Refinement of LANA reporting scales to enhance meaningful reporting and evidence-based decision making.

MoE leadership standards alignment with regional leadership capabilities conducted.

MoE systems for monitoring school principal performance are strengthened and enhanced.
```

---

## DATA & EMIS TEAM

```text
Enhanced national capacity and systems to produce validated SDG 4 data that is published and effectively used for SOPER, regional and national reporting and policy decision making.

Strengthened country capacity and systems to report education data through UIS/SDG 4 reporting mechanisms and PacSIMS EMIS.

Improve EMIS readiness, adoption and functionality across countries.

Strengthen coordination and collaboration between SPC, UIS and member countries.

Timely high-quality SOPER reporting supported by consolidated, validated and harmonised regional data inputs.
```

---

## IT TEAM

```text
PacSIMS-EMIS Phase 1 is operationalised in PICs.

SPFSC and Micro-qualification Moodle platforms are successfully migrated to a new hosting environment.

Talanoa Hub is successfully migrated to SPC hosting.

SPFSC exam results are successfully finalised and delivered.

National examination results are successfully processed and delivered.

PALS data is successfully compiled and delivered to LSA.
```

---

## CORPORATE TEAM

```text
A PBEQ endorsed business plan aligned to agreed indicators effectively guides strategic decision making and programme implementation.

Strengthened and sustained donor partnerships enabling improved resource mobilisation.

Stronger alignment and collaboration with SPC systems and processes operationalises the OneSPC vision and improves organisational coherence.
```

---

## COOL TEAM

```text
Donors, partners and stakeholders receive timely, reliable results reporting that informs accountability and decision-making.

A fit-for-purpose MEL process and system is embedded and actively supports divisional business plan implementation.

Up-to-date knowledge and digital systems are maintained and accessible to stakeholders.

Evidence-driven learning culture is embedded, capturing impacts and the level of change to shape strategic direction and decision-making.

Strengthened stakeholder engagement through effective feedback loops with divisional stakeholders, partners and donors.
```

---

# ACTION PLAN CARD DESIGN

```text
┌────────────────────────────────────────────┐
│ Action Type                                │
│ ▼ START                                    │
├────────────────────────────────────────────┤
│ Action Description                         │
│ _________________________________________  │
├────────────────────────────────────────────┤
│ Team                                       │
│ ▼ Qualifications Team                      │
├────────────────────────────────────────────┤
│ Team Outcome Statement                     │
│ ▼ Improved access to quality and industry  │
│   relevant training packages for learners  │
├────────────────────────────────────────────┤
│ Progress Impact                            │
│ ● Accelerates Outcomes                     │
├────────────────────────────────────────────┤
│ Owner                                      │
│ _________________________________________  │
├────────────────────────────────────────────┤
│ Due Date                                   │
│ _________________________________________  │
├────────────────────────────────────────────┤
│ Success Indicator                          │
│ _________________________________________  │
├────────────────────────────────────────────┤
│ Status                                     │
│ ▼ In Progress                              │
└────────────────────────────────────────────┘
```

---

# DASHBOARD CHANGES

## NEW WIDGET

### Actions by Outcome Statement

Chart Type:

```text
Horizontal Bar Chart
```

Metrics:

- STOP Actions
- START Actions
- CONTINUE Actions
- Completion Rate
- Open Actions

Group By:

- Team
- Outcome Statement

---

## NEW WIDGET

### Outcome Progress Heat Map

Columns:

```text
Outcome Statement
Total Actions
Completed Actions
Completion %
Progress Score
```

Colour Scale:

```text
🔴 Low Progress

🟡 Moderate Progress

🟢 High Progress
```

---

# FILTER PANEL CHANGES

Add:

```text
Team
Outcome Statement
Action Type
Status
Progress Impact
Workshop Session
```

---

# DATABASE CHANGE

## CREATE TABLE

```sql
CREATE TABLE team_outcome_statements (
    id UUID PRIMARY KEY,
    team_id UUID REFERENCES teams(id),
    outcome_statement TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## UPDATE ACTION PLANS

```sql
ALTER TABLE action_plans
ADD COLUMN team_outcome_statement_id UUID
REFERENCES team_outcome_statements(id);
```

---

# RELATIONSHIP MODEL

```text
TEAMS
  │
  ├── TEAM OUTCOME STATEMENTS
  │
  └── ACTION PLANS
          │
          └── STOP
          └── START
          └── CONTINUE
```

---

# FIGMA COMPONENTS TO UPDATE

Existing:

- Action Planning Form
- Team Dashboard
- Executive Dashboard
- Reflection Summary Page
- Filters Panel

New:

- Outcome Statement Selector
- Outcome Statements Library Panel
- Outcome Progress Widget
- Outcome Heat Map
- Outcome Details Modal

---

# DESIGN PRINCIPLE

Every action created during the reflection process must contribute directly to a recognised EQAP Team Outcome Statement.

This creates a visible pathway from:

```text
WHAT ISLAND
      ↓
HOW ISLAND
      ↓
SO WHAT ISLE
      ↓
NOW WHAT CAY
      ↓
ACTION
      ↓
TEAM OUTCOME
      ↓
EQAP RESULT
      ↓
ORGANISATIONAL IMPACT
```

The platform should clearly demonstrate how team reflections translate into measurable actions and outcomes, strengthening organisational learning, accountability and strategic performance.
