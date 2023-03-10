require("mason").setup()
require("mason-lspconfig").setup()

-- Auto setup/config for lsp servers
local capabilities = require("cmp_nvim_lsp").default_capabilities()
require("mason-lspconfig").setup_handlers({
    function(server_name)
        require("lspconfig")[server_name].setup({
            capabilities = capabilities
        })
    end,

	-- Dedicated handlers for each lsp server if needed
    ["lua_ls"] = function()
        require("lspconfig").lua_ls.setup({
            capabilities = capabilities,
            settings = {
                Lua = {
                    diagnostics = {
                        globals = {"vim"},
                    },
                    workspace = {
                        library = vim.api.nvim_get_runtime_file( "" , true ),
                    },
                }
            }
        })
    end
})

-- Adding border to lspinfo
require("lspconfig.ui.windows").default_options.border = "rounded"
