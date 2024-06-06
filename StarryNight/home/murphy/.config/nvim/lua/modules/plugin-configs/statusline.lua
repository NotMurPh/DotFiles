local function LspStatus()
    local buf_ft = vim.api.nvim_buf_get_option(0, 'filetype')
    local clients = vim.lsp.get_active_clients()

    if next(clients) == nil then
        return ""
    end

    for _, client in ipairs(clients) do
        local filetypes = client.config.filetypes
        if filetypes and vim.tbl_contains(filetypes, buf_ft) then
            return "󰅡 Lsp"
        end
    end

    return ""
end

local function Cwd()
    return vim.fn.fnamemodify( vim.fn.getcwd() , ":t" )
end

local colors = {
    black 	= "#27273a",
    grey 	= "#8f8fa3",
    white 	= "#ffffff",
	yellow 	= "#ffff00",
	yellow2 = "#dddd00",
    blue 	= "#80a0ff",
	blue2 	= "#7090dd",
    cyan 	= "#79dac8",
	cyan2 	= "#68c9b7",
    red 	= "#ff5189",
    red2 	= "#ee4078"
}

local theme = {
    normal 	= {
    	a 	= { fg = colors.black , bg = colors.blue },
        b 	= { fg = colors.black , bg = colors.blue2 },
        c 	= { fg = colors.grey , bg = colors.black },
    },
    insert 	= {
		a 	= { fg = colors.black , bg = colors.yellow },
        b 	= { fg = colors.black , bg = colors.yellow2 },
	},
    visual 	= {
		a 	= { fg = colors.black , bg = colors.cyan },
        b 	= { fg = colors.black , bg = colors.cyan2 },
	},
    replace 	= {
		a 	= { fg = colors.black , bg = colors.red },
        b 	= { fg = colors.black , bg = colors.red2 },
	},
}

require("lualine").setup {
	options = {
		theme = theme,
		globalstatus = true,
		section_separators = { left = "" , right = "" },
		component_separators = "",
		padding = 1
	},

	sections = {
		lualine_a = {{ "mode" , padding = { left = 2 , right = 1 } , icon = "" }},
		lualine_b = {},
		lualine_c = {
			{
				"progress",
				padding = { left = 2 , right = 0 }
			},

			"location",
			"%=",

			{
				colors = { spinner = colors.grey , lsp_client_name = colors.grey , use = true },
				separators = { lsp_client_name = { pre = "Lsp : " , post = "" }},
				timer = { progress_enddelay = 1000 , spinner = 1600 , lsp_client_name_enddelay = 0 },
				spinner_symbols = { "󰝦" , "󰪞" , "󰪟" , "󰪠" , "󰪡" , "󰪢" , "󰪣" , "󰪤" , "󰪥" },
				display_components = { "lsp_client_name" , "spinner" },
				"lsp_progress",
			},

			{
				"diagnostics",
				symbols = { error = " " , warn = " " , info = " " , hint = " " },
			}
		},
		lualine_x = {{ "branch" , icon = "" } , { LspStatus , padding = { left = 2 , right = 2 }}},
		lualine_y = {
			{
				"filetype",
				icon_only = true,
				colored = false,
				padding = { left = 1 , right = 0 }
			},

			{
				"filename",
				file_status = true,
				symbols = {
					modified = "󰏫",
					readonly = "󰷭",
					unnamed = ""
				},
				padding = { left = 1 , right = 2 }
			}
		},
		lualine_z = {{ Cwd,icon = "" , padding = { left = 1 , right = 2 }}}
	}
}
