/**
 * Document options and short descriptions of the sample data used for AI generation.
 * Users compare these to the generated output to understand how the AI used the context.
 */
export const AI_DOCUMENT_OPTIONS = [
  {
    id: 'two-pager',
    label: 'Two-pager — Acme Corp / Widget Pro',
    summary: 'SaaS product launch (remote team tool). Summary, problem/solution, beta metrics, investor ask.',
    description:
      'Sample: Acme Corp launching Widget Pro—a SaaS platform that cuts meeting overhead for remote teams. Includes executive summary, problem (meeting overload, lost context), solution (single workspace + integrations), beta metrics (12 companies, NPS 52), and ask (investor call, intros to HR/ops). Compare this to the draft to see how the AI expands bullets into prose.',
  },
  {
    id: 'two-pager-techstart',
    label: 'Two-pager — TechStart Inc / DataSync',
    summary: 'Data pipeline product. ETL platform, customer segment, metrics, pilot ask.',
    description:
      'Sample: TechStart Inc and DataSync—a no-code ETL platform for data teams. Includes summary (50+ connectors, Series A raise), problem (engineering time on pipelines, slow new sources), solution (pre-built connectors, SOC 2), metrics (45 customers, NPS 68, 18 min to first pipeline), and ask (pilot, referrals). Compare to the output to see how the AI shapes the narrative.',
  },
  {
    id: 'quarterly-review',
    label: 'Quarterly review — Acme Corp Q1 2025',
    summary: 'Startup quarterly. Wins, metrics table, challenges, priorities, support needed.',
    description:
      'Sample: Acme Corp Q1 2025. Wins (beta launch, pre-seed, hiring), metrics table (MRR, active teams, NPS), challenges (legal delays, competitor messaging), priorities (paid tiers, case studies, hiring), support needed (legal template, intros). Use this to compare input context to the generated review.',
  },
  {
    id: 'quarterly-review-nonprofit',
    label: 'Quarterly review — Riverside Foundation Q4 2025',
    summary: 'Nonprofit quarterly. Program wins, grant metrics, challenges, priorities, support.',
    description:
      'Sample: Riverside Community Foundation Q4 2025. Wins (mentorship program, grants, Program Director hire), metrics (participants, grant funding, volunteer hours), challenges (report delays, mentor retention), priorities (FY26 grants, impact report, program expansion), support (legal, board intros). Compare to the draft to see how the AI structures a nonprofit update.',
  },
];
