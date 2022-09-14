# 🕵️‍♂️ tsc-report-analyzer

## 📓 Install

```bash
yarn add @themenu/tsc-report-analyzer
```

## 📓 Usage

```bash
tsc --noEmit | ./node_modules/.bin/tsc-report-analyzer
```

You can also change the sources folders by using options (default is `src`)

```bash
tsc --noEmit | ./node_modules/.bin/tsc-report-analyzer --sources lib --source other
```