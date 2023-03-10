-- Reloads Neovim after whenever you save plugins.lua
vim.cmd([[
    augroup packer_user_config
	autocmd!
	autocmd BufWritePost plugins.lua source <afile> | PackerSync
	augroup END
]])

return require("packer").startup(function(use)

    -- Start of plugins --

    -- Utils
    use("wbthomason/packer.nvim")
    use("nvim-lua/plenary.nvim")
    use("numToStr/Comment.nvim")
    use("windwp/nvim-autopairs")
    use("lukas-reineke/indent-blankline.nvim" )
    use("lewis6991/gitsigns.nvim")
    use("sindrets/diffview.nvim")
    use("akinsho/toggleterm.nvim")
    use("RishabhRD/popfix")
    use("RishabhRD/nvim-cheat.sh")
    use("norcalli/nvim-colorizer.lua")
    use("JASONews/glow-hover.nvim")
    use("nvim-telescope/telescope.nvim")
	use{"nvim-telescope/telescope-fzf-native.nvim" , run = "cmake -S. -Bbuild -DCMAKE_BUILD_TYPE=Release && cmake --build build --config Release && cmake --install build --prefix build" }
	use("glepnir/dashboard-nvim")

    -- LSP 
	use {
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
    "neovim/nvim-lspconfig",
	}

	-- CMP
	use("hrsh7th/nvim-cmp")
    use("hrsh7th/cmp-nvim-lsp")
    use("hrsh7th/cmp-nvim-lua")
	use("hrsh7th/cmp-buffer")
    use("hrsh7th/cmp-path")
    use("hrsh7th/cmp-calc")
	use("onsails/lspkind.nvim")
	use{ "L3MON4D3/LuaSnip" , run = "make install_jsregexp" }
	use("saadparwaiz1/cmp_luasnip")
	use("rafamadriz/friendly-snippets")

    -- Theme
    use("nvim-treesitter/nvim-treesitter")
    use{ "catppuccin/nvim" , as = "catppuccin" }
	use("folke/tokyonight.nvim")

    -- Statusline
    use("arkav/lualine-lsp-progress")
    use("nvim-lualine/lualine.nvim")

    -- Filetree
    use("nvim-tree/nvim-web-devicons")
    use("nvim-tree/nvim-tree.lua")

    -- Bufferline
    use("akinsho/bufferline.nvim")
    use("famiu/bufdelete.nvim")

	-- End of plugins --

  if packer_bootstrap then
    require("packer").sync()
  end
end)
