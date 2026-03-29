# Blog Post Improvement Loop

Adapted from Karpathy's autoresearch pattern: `research → write → publish → measure → analyze → improve → repeat`

## How to Run

For each blog post in `src/data/blog/*.json`:

### 1. RESEARCH
- Search Google for the post's `targetKeyword`
- Note the top 3 ranking pages and their URLs

### 2. ANALYZE
For each of the top 3 results, analyze:
- **Word count** — how long is their content?
- **Heading structure** — what H2/H3 topics do they cover?
- **FAQ sections** — how many FAQ items? What questions?
- **Schema markup** — do they have BlogPosting, FAQPage, BreadcrumbList?
- **Internal/external links** — what do they link to?
- **Unique content** — what topics do they cover that we don't?
- **Visuals** — do they use images, tables, infographics?

### 3. COMPARE
Create a gap analysis:
- List topics the top results cover that our post doesn't
- List FAQ questions they answer that we don't
- Compare word counts
- Check if they have better heading structure for featured snippets
- Note any statistics or official sources they cite

### 4. IMPROVE
Rewrite/expand the post to fill gaps:
- Add missing subtopics as new sections
- Add more FAQ items (target 15+ per post)
- Improve heading structure — use question-format H2s for featured snippet potential
- Add statistics and cite official UAE government sources (RTA, MOI)
- Strengthen internal links to quiz modules with compelling CTAs
- Add comparison tables where relevant
- Ensure content is more comprehensive than any competitor

### 5. VERIFY
- Ensure all facts are accurate and up-to-date
- Check that JSON is valid
- Verify internal links point to real quiz modules
- Confirm FAQ answers are complete and helpful

### 6. DEPLOY
- Commit changes with descriptive message
- Push and deploy
- Request indexing via Google Search Console

### 7. MEASURE
After 1-2 weeks:
- Check ranking position for target keyword in Google Search Console
- Note impressions, clicks, CTR, average position
- Record in the post's rankHistory if tracking

### 8. REPEAT
- Re-run steps 1-7
- Focus on posts not yet in top 5
- Prioritize posts with high impressions but low CTR (improve titles/descriptions)

## Priority Order

Run improvement loop on posts in this priority order (highest search volume first):
1. rta-theory-test-dubai-complete-guide
2. rta-theory-test-questions-answers-2026
3. how-to-pass-rta-theory-test-first-time
4. uae-road-signs-complete-guide
5. dubai-driving-license-cost-2026
6. uae-traffic-fines-black-points-2026
7. abu-dhabi-driving-theory-test-guide
8. uae-driving-test-tips-expats
9. motorcycle-theory-test-uae-guide
10. rta-theory-test-hindi-urdu-guide

## Prompt Template

When running the loop with Claude, use this prompt:

```
Read the blog post at src/data/blog/[slug].json.
Search Google for "[targetKeyword]".
Fetch and analyze the top 3 results.
Compare our post against them and list content gaps.
Rewrite the post to be more comprehensive, filling all gaps.
Ensure the JSON remains valid and all internal links work.
```
