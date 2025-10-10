#!/bin/bash
set -e

echo "=== Setting up development environment on macOS Sequoia ==="

# Install Homebrew if not already installed
if ! command -v brew &>/dev/null; then
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Update Homebrew
echo "Updating Homebrew..."
brew update

# 1. Node.js v20 LTS
echo "Installing Node.js v20 LTS..."
brew install node@20
brew link --overwrite node@20

# 2. Git
echo "Installing Git..."
brew install git

# 3. Cursor (AI-first IDE, better than VSCode)
#echo "Installing Cursor..."
#brew install --cask cursor

# 4. MongoDB Community Edition
echo "Installing MongoDB Community Edition..."
brew tap mongodb/brew
brew install mongodb-community@7.0   # Latest stable Community version
brew services start mongodb-community@7.0

# 5. Docker Desktop (optional but recommended)
read -p "Do you want to install Docker Desktop? (y/n): " install_docker
if [[ "$install_docker" == "y" ]]; then
  echo "Installing Docker Desktop..."
  brew install --cask docker
  echo "👉 Launch Docker Desktop manually from Applications after install."
fi

echo "=== ✅ Setup complete! ==="
echo "Installed: Node.js v20, Git,  MongoDB, and optionally Docker Desktop."
