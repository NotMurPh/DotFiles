vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

require("nvim-tree").setup({

    view = {
        adaptive_size = false,
        width = 30,
        mappings = {
			list = {
				{ key = {"l"} , action = "edit" },
				{ key = {"h"} , action = "close_node" },
				{ key = {"<CR>"} , action = "cd" }
			}
        }
    },

    renderer = {
		root_folder_label = ":t",
        indent_markers = {
            enable = true
        }
    },

	diagnostics = {
        enable = true
	},

    update_focused_file = {
        enable = true
    },

	modified = {
        enable = true,
		show_on_open_dirs = false
	},

	actions = {
        change_dir = {
			global = true,
			restrict_above_cwd = false,
        }
	},

})

-- Auto close nvim tree when is only buffer left
vim.api.nvim_create_autocmd("BufEnter" , {
    nested = true,
    callback = function()
        if #vim.api.nvim_list_wins() == 1 and vim.api.nvim_buf_get_name(0):match("NvimTree_") ~= nil then
            vim.cmd("quit")
        end
    end
})
