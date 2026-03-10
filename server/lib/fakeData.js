/**
 * Fake/sample data passed to Gemini as context to generate document payloads.
 * Each object is used in the prompt; Gemini returns the full template-shaped payload.
 */

/** Map full option id to Handlebars template name (e.g. two-pager-techstart -> two-pager). */
export function getTemplateName(documentType) {
  if (documentType.startsWith('two-pager')) return 'two-pager';
  if (documentType.startsWith('quarterly-review')) return 'quarterly-review';
  return documentType;
}

export function getFakeData(documentType) {
  switch (documentType) {
    case 'two-pager':
      return {
        companyName: 'Acme Corp',
        product: 'Widget Pro',
        tagline: 'Streamlined workflow for remote teams',
        summaryPoints: [
          'Acme Corp is launching Widget Pro, a SaaS platform that reduces meeting overhead by 40%.',
          'Target market: mid-size companies (100–500 employees) with distributed teams.',
          'Seeking $2M seed to scale engineering and go-to-market.',
        ],
        problemPoints: [
          'Teams spend 15+ hours per week in status and alignment meetings.',
          'Context is lost across tools (email, Slack, docs), leading to rework.',
        ],
        solutionPoints: [
          'Single workspace for goals, tasks, and async updates with smart digests.',
          'Integrations with Slack, Google Workspace, and Jira; no rip-and-replace.',
        ],
        metrics: [
          'Beta: 12 companies, 85% weekly active usage.',
          'NPS 52; 40% of users say they would pay at launch.',
        ],
        askPoints: [
          'Schedule a 30-minute call with your investment team.',
          'Introductions to 2–3 mid-market HR or ops leaders for pilot conversations.',
        ],
      };
    case 'two-pager-techstart':
      return {
        companyName: 'TechStart Inc',
        product: 'DataSync',
        tagline: 'Unified data pipelines for growing teams',
        summaryPoints: [
          'TechStart Inc offers DataSync, a no-code ETL platform that connects 50+ sources to warehouses in minutes.',
          'Focus: data teams at Series A–B companies who need faster onboarding than hand-coded pipelines.',
          'Raising a $4M Series A to expand sales and add real-time streaming.',
        ],
        problemPoints: [
          'Engineering spends 40% of sprint time maintaining custom connectors and pipeline code.',
          'New data sources often take 2–4 weeks to integrate, blocking analytics and ML.',
        ],
        solutionPoints: [
          'Pre-built connectors and schema mapping with automatic type inference and incremental sync.',
          'Self-serve setup; no engineering required for most sources. SOC 2 Type II certified.',
        ],
        metrics: [
          '45 paying customers; 120% net revenue retention in the last 12 months.',
          'NPS 68; G2 rating 4.7. Average time to first pipeline: 18 minutes.',
        ],
        askPoints: [
          'Pilot with your data team: 2–3 sources, 30-day evaluation.',
          'Referrals to data leaders at Series B+ companies in fintech or healthcare.',
        ],
      };
    case 'quarterly-review':
      return {
        orgName: 'Acme Corp',
        period: 'Q1 2025',
        wins: [
          'Shipped Widget Pro beta to 12 design partners; 10 active weekly.',
          'Closed $1.2M pre-seed; runway through Q3 2025.',
          'Hired first Head of Product; engineering team now 4.',
        ],
        metrics: [
          { metric: 'MRR (beta)', target: '$8K', actual: '$6.2K', note: 'Onboarding lag in Feb' },
          { metric: 'Weekly active teams', target: '15', actual: '12', note: 'On track for Q2' },
          { metric: 'NPS', target: '45', actual: '52', note: 'Above target' },
        ],
        challenges: [
          'Two key beta accounts delayed legal review; pushed expansion to Q2.',
          'Competitor launched similar positioning; need clearer differentiation in messaging.',
        ],
        priorities: [
          'Launch paid tiers and migrate 5 beta customers by end of Q2.',
          'Publish 2 case studies and refine website messaging.',
          'Hire 2 more engineers (backend, frontend).',
        ],
        supportNeeded: [
          'Legal template for enterprise pilot agreements.',
          'Warm intros to 3–5 mid-market HR/ops leaders for pipeline.',
        ],
      };
    case 'quarterly-review-nonprofit':
      return {
        orgName: 'Riverside Community Foundation',
        period: 'Q4 2025',
        wins: [
          'Launched youth mentorship program; 80 students matched with 45 mentors.',
          'Secured $120K in new grants; corporate partnership with Valley Bank for matching gifts.',
          'Hired Program Director; volunteer hours up 25% year-over-year.',
        ],
        metrics: [
          { metric: 'Program participants', target: '75', actual: '80', note: 'Over target' },
          { metric: 'Grant funding ($K)', target: '100', actual: '120', note: 'Two new funders' },
          { metric: 'Volunteer hours', target: '1,200', actual: '1,350', note: 'Corporate volunteer day' },
        ],
        challenges: [
          'Two key grant reports delayed; finance lead left in Nov, replacement starting Jan.',
          'Mentor retention lower in 18–24 cohort; revising onboarding and check-in cadence.',
        ],
        priorities: [
          'Close FY26 grant pipeline ($150K target) and publish annual impact report.',
          'Pilot family engagement track in mentorship program; expand to 100 students by Q2.',
          'Implement new CRM for donors and volunteers; train staff by Feb.',
        ],
        supportNeeded: [
          'Pro bono legal review for new grant agreements.',
          'Board intros to 2–3 corporate CSR or community relations leads.',
        ],
      };
    default:
      throw new Error(`Unknown document type: ${documentType}`);
  }
}
