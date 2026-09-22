# Premium iPad Campaign Experience

## Goal
Build a single, fast interactive presentation that guides each student through the boy campaign, then the girl campaign, and ends with both preferred choices celebrated.

## Experience
- Cinematic opening with “Student Pre-Elections”, “Two choices. One voice.”, and a large Begin button.
- Boy Vice President stage with three touch-friendly candidate cards using the supplied crocodile, football, and globe symbols.
- Harmless campaign jokes for the two alternatives; a stronger positive Crocodile presentation and confirmation.
- Girl Vice President stage with supplied peacock and dove symbols, playful messaging, and a stronger positive Peacock presentation and confirmation.
- Elegant final screen highlighting Muhammad Fasih Ur Rehman and Azla, with a Done state and no reset control.
- Fresh state on every browser reload.

## Visual Direction
- Apple keynote and visionOS-inspired restraint: white and black foundations, soft glass surfaces, precise typography, subtle depth, and short spring-like transitions.
- Purpose-built portrait and landscape iPad layouts with large tap targets, no keyboard input, and no unnecessary scrolling.
- Uploaded symbols retained as the campaign artwork, with polished framing and treatment.

## Technical Details
- Keep the experience entirely in the browser with lightweight React state; no database or voting backend.
- Store the five uploaded symbols as CDN assets for fast delivery.
- Use semantic design tokens in the global style system and accessible native controls.
- Add route-specific campaign metadata.
- Verify compilation and the complete interaction flow at iPad portrait and landscape sizes.
