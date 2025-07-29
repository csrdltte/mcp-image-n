
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod'
import { exec } from 'child_process'

// 1. Crear el servidor MCP
// el servidor es la interfaz principal con el protocolo MCP. Maneja la comunicación y la lógica de negocio.

const server = new McpServer({
  name: 'mcpImageN',
  version: '1.0.0',
  description: 'MCP server for image operations and conversions',
})

// 2. Definir herramienta
// Las herramientas permiten al LLM realizar acciones específicas. 
server.tool(
  'convet-to-black-and-white',
  'Convert an image to black and white',
    {
        inputImageFullPath: z.string(),
        outputImageFullPath: z.string(),
        options: z.string().optional()
    },
    async ({ inputImageFullPath, outputImageFullPath, options }) => {
        const command = `magick ${inputImageFullPath} -colorspace Gray ${options || ''} ${outputImageFullPath}`;
        exec(command , (error, stdout, stderr) => {
            if (error) {
            throw new McpError(ErrorCode.InternalError, `The operation failed. Process error: ${stderr}`);
            }
        })
        return {
            content: [{ 
                type: "text", 
                text: `Image processed in ${outputImageFullPath}` 
            }],
        };
    }
)



// 3. Escuchar las conexiones del cliente
const transport = new StdioServerTransport()
await server.connect(transport)




