# RETROSPECTIVE 3 (Team 02)

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done
  - 4 vs. 4
- Total points committed vs done
  - 27 vs. 27
- Nr of hours planned vs spent (as a team)

Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |         | -      |            |              |
| _#19_ | 2       | 3      | 1h 45m     | 1h           |
| _#10_ | 7       | 18     | 12h 50m    | 13h 36m      |
| _#20_ | 2       | 3      | 1h         | 1h           |
| _#14_ | 2       | 3      | 3h         | 2h 55m       |

- Hours per task (average, standard deviation)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated 1h 30m
  - Total hours spent     2h 20m
  - Nr of automated unit test cases 156
  - Coverage (if available)   87.74%
- E2E testing:
  - Total hours estimated     4h
  - Total hours spent     4h 10m
- Code review
  - Total hours estimated  6h
  - Total hours spent      6h
- Technical Debt management:
  - Strategy adopted [see Technical Debt Plan](../Technical%20Debt%20Plan.md)
  - Total hours estimated estimated at sprint planning 5h
  - Total hours spent 5h 13m

## ASSESSMENT

- What caused your errors in estimation (if any)?

  We underestimated SonarCloud improvements and the time required to resolve them. We thought it would hav ebeen easier to solve those issues, so we gave more importance to other tasks. We also didn't think that refactoring some routes would lead to a need of new tests to be written. So few tasks about testing were estimated.

- What lessons did you learn (both positive and negative) in this sprint?

  Refactoring poorly written code turned out to be far more challenging and time-consuming than expected, which significantly delayed progress and reduced the time available for developing new features. This experience highlighted the critical importance of ensuring code readability and maintainability from the start to avoid such setbacks.

  Additionally, addressing the issues identified by SonarCloud should have been prioritized at the beginning of the sprint. Tackling these changes early would have allowed the rest of the sprint to focus on feature implementation, ensuring that no team member was blocked by dependencies. Underestimating the effort required for these adjustments also revealed the need for more accurate planning and prioritization to prevent similar bottlenecks in the future.

  Even if it was a very diffcult sprint with all the changes to be done and the new features to implement, we still managed to achieve our goals.

- Which improvement goals set in the previous retrospective were you able to achieve?
  
  We managed to improve the readability of the README, making it easier to work on the new code. Having a much clearer specification on what should be done and how the previous features were implemented, helps working faster and in a more efficient way.

- Which ones you were not able to achieve? Why?
  
  Improving the test coverage was a very ambitious goal and we knew it was gonna be very difficult. We failed to do this also because the stakeholders provided the FAQ answers, meaning we had to change a lot of the code previously written. This meant spending most of the time in refactoring the old tests rather than creating new ones, inevitably leading to a decrease in the test coverage.


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Improve the test coverage by adding more tests for the new features.
  - Give more importance to SonarCloud issues, in order to not find out at the end of the sprint that there are many problems to fix all at once.
  - The priority should first complete the changes related to the previous sprint, remembering that the changes should be emrged as soon as possible so that everyuone can start correctly working on the new ones.

- One thing you are proud of as a Team!!

  Even in difficult times and stressful situations, we managed to overcome all the obstacles and achieve our goals. We also managed to finallt discover the center of Kiruna!