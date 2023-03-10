-- Bufferline
require("bufferline").setup({
    options = {
		show_buffer_close_icons = true,
		buffer_close_icon = "-",
		modified_icon = "󰏫",
		left_trunc_marker = "",
		right_trunc_marker = "",
		color_icons = false,
		show_buffer_icons = false,
		separator_style = "thin",

		indicator = {
			icon = "▍",
			style = "icon"
		},

        offsets = {
            {
				padding = 0,
                filetype = "NvimTree",
                text = "File Explorer",
                text_align = "center",
                separator = true
            }
        },

		name_formatter = function(buf)
			if buf.name:find("%.") then
				if buf.name:sub(1,1) == "." and not buf.name:find("%.", 2) then
					return buf.name
				else
					return "  " .. buf.name:match("(.-)%.[^%.]+$")
				end
			end
			return buf.name
		end,

		custom_filter = function (bufnum)
			if vim.fn.bufname(bufnum) ~= "[No Name]" then
				return true
			end
			return false
		end,
    }
})

-- Highlights
require("modules.base").BufferLineHighlights()

-- Avoid scrolling when switching buffers
vim.api.nvim_exec([[
" Save current view settings on a per-window, per-buffer basis.
function! AutoSaveWinView()
    if !exists("w:SavedBufView")
        let w:SavedBufView = {}
    endif
    let w:SavedBufView[bufnr("%")] = winsaveview()
endfunction
" Restore current view settings.
function! AutoRestoreWinView()
    let buf = bufnr("%")
    if exists("w:SavedBufView") && has_key(w:SavedBufView, buf)
        let v = winsaveview()
        let atStartOfFile = v.lnum == 1 && v.col == 0
        if atStartOfFile
            call winrestview(w:SavedBufView[buf])
        endif
        unlet w:SavedBufView[buf]
    endif
endfunction
" When switching buffers, preserve window view.
if v:version >= 700
    autocmd BufLeave * call AutoSaveWinView()
    autocmd BufEnter * call AutoRestoreWinView()
endif
]], true)
