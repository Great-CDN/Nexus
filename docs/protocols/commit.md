## Commit Protocol

Git history is the audit trail. It must be readable and meaningful.

### Conventional Commits

Use the Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature.
- `fix`: Bug fix.
- `docs`: Documentation only.
- `style`: Formatting, missing semicolons, etc. (no code change).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding or correcting tests.
- `chore`: Build process, dependencies, etc.

### Commit Rules

1. **One task, one commit**. Do not bundle unrelated changes.
   - A "task" is defined by the spec or task reference. If a single session covers multiple logically separate changes (different acceptance criteria), split into multiple commits.
   - Light Workflow exception: A single commit is acceptable if all changes are trivial, related to the same UI surface or API endpoint, and documented in the commit message body.
2. **Commit message explains why, not what**. The diff shows what; the message explains why.
3. **Reference the spec**. If a commit implements AC-3, mention it: `feat(auth): implement password reset (AC-3)`.
4. **No WIP commits in main**. Feature branches can have WIP commits, but squash or clean before merge.
5. **Commit after every task**. Small commits are cheap. Large rollbacks are expensive.

### Signed Commits (Recommended)

Git history is the audit trail. Unsigned commits can be forged. For Decide-phase merges to `main`, use GPG or SSH commit signing.

```bash
# Enable SSH signing (simpler than GPG)
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

This is optional for feature branches and Light Workflow changes, but mandatory for anything that touches security-critical code.

---
