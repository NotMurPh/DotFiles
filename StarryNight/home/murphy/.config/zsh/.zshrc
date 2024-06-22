# Configure zsh
unsetopt autocd

# Completion
zstyle ':completion:*' menu select
zstyle ':completion::complete:*' gain-privileges 1
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zmodload zsh/complist
((fpath=($fpath "/usr/share/zsh/functions/Completion/Zsh")) &)

# Autoloads
autoload -Uz compinit && compinit
autoload -U up-line-or-beginning-search
autoload -U down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search

# Binds
bindkey -M menuselect '^[[Z' reverse-menu-complete
bindkey "^[[A" up-line-or-beginning-search # Up
bindkey "^[[B" down-line-or-beginning-search # Down
bindkey -e

# History
HISTFILE=~/.config/zsh/.zsh_history
HISTSIZE=100000
SAVEHIST=100000
setopt SHARE_HISTORY

# Prompt
netns=$(ip netns identify)
if [ -n "$netns" ]; then
    netns="%F{blue}($netns) "
fi

PS1="%B$netns%F{yellow}%n %(?.%F{green}.%F{red})➜ %F{blue}%1~ %b%F{white}"

# Plugins
source /home/murphy/.config/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /home/murphy/.config/zsh/plugins/zsh-vi-mode/zsh-vi-mode.plugin.zsh

# Aliases
alias ls="ls --color=auto"
alias vim=nvim
alias vpn="sudo -E NetScope vpn"

#lfcd
lf() {
	cd "$(/bin/lf -print-last-dir $@)"
}

swap() {
    local TMPFILE=tmp.$$
    sudo mv "$1" $TMPFILE && sudo mv "$2" "$1" && sudo mv $TMPFILE "$2"
}

ipinfo() {
    curl http://ip-api.com/$1
}

feh() {
	/usr/bin/feh --keep-zoom-vp -g 1600x900 "$@"
}
