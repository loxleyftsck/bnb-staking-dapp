# Contributing to BNB Staking DApp

Thank you for considering contributing to BNB Staking DApp! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**

- Harassment of any kind
- Trolling, insulting comments, personal attacks
- Publishing others' private information

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Git
- MetaMask (for testing)

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/bnb-staking-dapp.git
cd bnb-staking-dapp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Run tests to verify setup
npm test
```

## 💻 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/YourTest.test.js

# Check gas usage
REPORT_GAS=true npm test
```

### 4. Commit Your Changes

Follow conventional commits format:

```bash
git commit -m "feat: add new staking tier feature"
git commit -m "fix: resolve reward calculation bug"
git commit -m "docs: update README with new examples"
git commit -m "test: add edge case for unstaking"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `chore`: Maintenance tasks

## 📐 Coding Standards

### Solidity Code

**Style Guide:**

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use 4 spaces for indentation
- Maximum line length: 120 characters
- Use NatSpec comments for all public functions

**Example:**

```solidity
/**
 * @notice Stakes tokens to earn rewards
 * @dev Requires prior token approval
 * @param amount Amount of tokens to stake
 */
function stake(uint256 amount) external nonReentrant whenNotPaused {
    require(amount >= MIN_STAKE, "StakingPool: Below minimum stake");
    // Implementation...
}
```

**Security:**

- Always use OpenZeppelin contracts when possible
- Include reentrancy guards on external functions
- Validate all inputs
- Use SafeMath (or Solidity 0.8+ built-in checks)
- Emit events for all state changes

### JavaScript/TypeScript Code

**Style:**

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Comment complex logic

**Testing:**

- One test file per contract
- Group tests using `describe()` blocks
- Use descriptive test names: "Should [expected behavior] when [condition]"

## 🧪 Testing Requirements

### Minimum Requirements

- All new features must include tests
- Bug fixes must include regression tests
- Maintain or improve test coverage
- All tests must pass before PR

### Test Structure

```javascript
describe("ContractName", function () {
    describe("FunctionName", function () {
        it("Should [expected behavior] when [condition]", async function () {
            // Arrange
            const setup = await setupTest();
            
            // Act
            const result = await contract.function(params);
            
            // Assert
            expect(result).to.equal(expected);
        });
    });
});
```

### Running Tests

```bash
# All tests
npm test

# Specific test
npx hardhat test test/MyToken.test.js

# With coverage
npx hardhat coverage

# With gas reporting
REPORT_GAS=true npm test
```

## 🔄 Pull Request Process

### Before Submitting

1. ✅ All tests pass
2. ✅ Code follows style guidelines
3. ✅ Documentation is updated
4. ✅ Commits follow conventional format
5. ✅ No merge conflicts with main branch

### PR Template

**Title:** Clear, concise description (max 72 characters)

**Description:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated Checks**: CI/CD runs tests automatically
2. **Code Review**: Maintainer reviews within 48 hours
3. **Address Feedback**: Make requested changes
4. **Approval**: Minimum 1 approval required
5. **Merge**: Squash and merge to main

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify on latest version
3. Test on clean environment

### Bug Report Template

```markdown
**Description:**
Clear description of the bug

**To Reproduce:**
1. Step one
2. Step two
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Environment:**
- Node version:
- Hardhat version:
- Network: (local/testnet/mainnet)

**Screenshots/Logs:**
If applicable

**Additional Context:**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
Other approaches you've thought about

**Additional Context:**
Mockups, examples, references
```

## 🔐 Security Vulnerabilities

**DO NOT** report security vulnerabilities in public issues.

Instead:

- Email: [security email]
- Include detailed reproduction steps
- Allow time for patch before disclosure

See [SECURITY.md](./SECURITY.md) for full policy.

## 📚 Documentation

### When to Update Docs

- New features added
- API changes
- Configuration changes
- Deployment process changes

### Documentation Locations

- `README.md` - Project overview, quick start
- `SECURITY.md` - Security features and policies
- `docs/` - Detailed technical documentation
- Inline comments - Code-level documentation
- NatSpec - Smart contract documentation

## 🎯 Development Priorities

### High Priority

- Security improvements
- Bug fixes
- Performance optimizations
- Test coverage improvements

### Medium Priority

- New features with clear use cases
- Documentation improvements
- UX enhancements

### Low Priority

- Nice-to-have features
- Minor optimizations
- Code style improvements

## 🏆 Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commit history

## ❓ Questions?

- Open a GitHub issue with "Question:" prefix
- Check existing discussions
- Review documentation first

## 📞 Contact

- GitHub Issues: [Project Issues](https://github.com/loxleyftsck/bnb-staking-dapp/issues)
- Discussions: [GitHub Discussions](https://github.com/loxleyftsck/bnb-staking-dapp/discussions)

---

**Thank you for contributing to BNB Staking DApp!** 🚀
