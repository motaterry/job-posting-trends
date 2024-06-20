#!/bin/bash

# Create the .gnupg directory if it doesn't exist
mkdir -p ~/.gnupg

# Configure GPG
echo "use-agent" > ~/.gnupg/gpg.conf
echo "allow-loopback-pinentry" > ~/.gnupg/gpg-agent.conf

# Reload the gpg-agent
gpg-connect-agent reloadagent /bye

# Set environment variables
echo "export GPG_TTY=$(tty)" >> ~/.bashrc
echo "export GPG_TTY=$(tty)" >> ~/.profile
echo "export GPG_OPTS=\"--pinentry-mode=loopback\"" >> ~/.bashrc
echo "export GPG_OPTS=\"--pinentry-mode=loopback\"" >> ~/.profile
source ~/.bashrc

# Configure Git
git config --global gpg.program gpg
git config --global commit.gpgSign true
git config --global gpg.format openpgp
git config --global gpg.ssh.allowedSignersFile ~/.gnupg/allowedSigners
git config --global user.signingkey 719D94BDB015C9DA

echo "GPG and Git have been configured for signing commits."

