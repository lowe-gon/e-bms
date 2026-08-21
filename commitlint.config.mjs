// Standard, battle-tested Gitmoji header pattern:
// Matches: "✨ feat(auth): add login" or "🐛 fix: patch memory leak"
const EMOJI_HEADER_REGEX =
  /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s+(\w+)(?:\((.*)\))?!?:\s+(.*)$/;

export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    name: 'conventional-changelog-conventionalcommits',
    parserOpts: {
      headerPattern: EMOJI_HEADER_REGEX,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
  prompt: {
    settings: {
      enableMultipleScopes: true,
      scopeEnumSeparator: ',',
    },
    questions: {
      type: {
        headerWithEmoji: true,
        enum: {
          build: {
            emoji: '🛠️',
            description: 'Changes affecting build system/deps',
            title: 'Builds',
          },
          chore: {
            emoji: '♻️',
            description: 'Other changes without src/test modifications',
            title: 'Chores',
          },
          ci: { emoji: '⚙️', description: 'CI config files and scripts', title: 'CI' },
          docs: { emoji: '📚', description: 'Documentation only changes', title: 'Docs' },
          feat: { emoji: '✨', description: 'A new feature', title: 'Features' },
          fix: { emoji: '🐛', description: 'A bug fix', title: 'Bug Fixes' },
          perf: {
            emoji: '🚀',
            description: 'Code change improving performance',
            title: 'Performance',
          },
          refactor: {
            emoji: '📦',
            description: 'Code change that neither fixes bug nor adds feature',
            title: 'Refactoring',
          },
          revert: { emoji: '🗑️', description: 'Reverts a previous commit', title: 'Reverts' },
          style: {
            emoji: '💎',
            description: 'Markup, white-space, formatting, semi-colons',
            title: 'Styles',
          },
          test: { emoji: '🚨', description: 'Adding or correcting tests', title: 'Tests' },
        },
      },
    },
  },
};
