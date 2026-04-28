# SA-902: Model API Keys Configuration

## User Story
**As a** user,
**I want to** configure my LLM provider API keys,
**so that** the AI analysis and RAG chat features can function with my preferred models.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Model API Keys tab content ([`1:637`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-637))

## Design Specifications
- Tab heading: "Model API Keys" + description "Configure your AI model providers to enable site analysis."
- Form fields:
  - **OPENAI API KEY**: Label in uppercase muted text, secure input (password-style) showing masked value "sk-proj-********************", helper text: "Keys are encrypted at rest and never shared."
  - **ANTHROPIC API KEY**: Same style, but in error state — red border, placeholder "Enter your Anthropic key", red error text below: "Invalid key format. Please check your credentials."
- Each input has:
  - Label (uppercase, muted)
  - Secure text input with masked display (dots/asterisks)
  - Show/hide toggle (eye icon) to reveal the key
  - Helper or error text below
- Inputs have standard border in normal state, blue border on focus, red border on error

## Acceptance Criteria
- [ ] API key inputs are masked by default (password-style display)
- [ ] Show/hide toggle reveals the actual key value
- [ ] Keys are validated on blur or on save:
  - Format validation (prefix check: `sk-` for OpenAI, `sk-ant-` for Anthropic)
  - Optionally: live validation by making a test API call
- [ ] Invalid keys show red border and descriptive error message
- [ ] Valid keys show green check indicator
- [ ] Keys are stored encrypted at rest using Electron's `safeStorage` API
- [ ] Helper text confirms encryption: "Keys are encrypted at rest and never shared."
- [ ] Support for additional providers can be added (extensible form)
- [ ] Removing a key and saving clears it from secure storage

## Validation Rules
| Field | Rule |
|-------|------|
| OpenAI API Key | Optional, must start with `sk-` if provided |
| Anthropic API Key | Optional, must start with `sk-ant-` if provided |
| Any key | No whitespace, minimum length check |

## States
| State | Behavior |
|-------|----------|
| Empty | Placeholder text, neutral border |
| Filled | Masked value, neutral border, helper text |
| Focused | Blue border, cursor active |
| Error | Red border, red error message below |
| Valid | Green check icon, confirmed encrypted |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Secure inputs use `type="password"` with show/hide toggle
- Error state border: `border-red-500`; valid state: `border-green-500` with check icon
- Keys stored encrypted via Electron's `safeStorage` API through IPC
- Validation with **Zod** schema for key format checking
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/ModelApiKeys.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | API key inputs masked by default | Unit | Verify input `type="password"` attribute |
| TC-02 | Show/hide toggle reveals key | Unit | Click eye icon, verify input `type` changes to "text" |
| TC-03 | Format validation (sk- prefix) | Unit | Enter "invalid-key", blur, verify `border-red-500` class and error message |
| TC-04 | Valid key shows green check | Unit | Enter "sk-proj-validkey123", blur, verify `border-green-500` and check icon |
| TC-05 | Keys stored encrypted via IPC | Integration | Save valid key, verify IPC `safeStorage:encrypt` called |
| TC-06 | Clearing key and saving removes it | Integration | Clear input, save, verify IPC delete called |
| TC-07 | Helper text shows encryption note | Unit | Verify "Keys are encrypted at rest and never shared." text present |
