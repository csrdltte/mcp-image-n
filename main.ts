
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod'
import { exec, execSync } from 'child_process'


class ImageNServer {
    private server: McpServer;

    constructor() {

        // 1. Crear el servidor MCP
        // el servidor es la interfaz principal con el protocolo MCP. Maneja la comunicación y la lógica de negocio.

        this.server = new McpServer({
            name: 'mcpImageN',
            version: '1.0.0',
            description: 'MCP server for image operations and conversions',
        },
            {
                capabilities: {
                    tools: {},
                },
            }
        )

        this.setupToolHandlers();
        this.server.server.onerror = (error: any) => {
            console.error('[MCP Server Error]', error);
            this.server.close();
        };
        console.log('MCP server ImageN initialized and ready to receive requests.');
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }




    // 2. Definir herramienta
    // Las herramientas permiten al LLM realizar acciones específicas. 
    private setupToolHandlers() {

        this.server.tool(
            'convet-to-black-and-white',
            'Convert an image to black and white',
            {
                inputImageFullPath: z.string(),
                outputImageFullPath: z.string(),
                options: z.string().optional()
            },
            async ({ inputImageFullPath, outputImageFullPath, options }) => {
                const command = `magick ${inputImageFullPath} -colorspace Gray ${options || ''} ${outputImageFullPath}`;
                exec(command, (error, stdout, stderr) => {
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

        this.server.tool(
            'convert-svg-to-png',
            'Convert a svg image into png image',
            {
                inputImageFullPath: z.string().describe('Full path of the input image'),
                outputImageFullPath: z.string().describe('Full path of the output image'),
                outputSize: z.string().optional().describe('Output size in pixels for the image, e.g., "200". The default value is 500px')
            },
            async ({ inputImageFullPath, outputImageFullPath, outputSize }) => {
                const command = `magick convert ${inputImageFullPath} -resize ${outputSize || '500'}  ${outputImageFullPath}`;
                var result = await new Promise<void>((resolve, reject) => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(new McpError(ErrorCode.InternalError, `The operation failed. Process error: ${stderr}`));
                        } else {
                            resolve();
                        }
                    });
                });
                return {
                    content: [{
                        type: "text",
                        text: `Image processed in ${outputImageFullPath}`
                    }],
                };
            }
        )


    }

    // 3. Escuchar las conexiones del cliente
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('ImageN MCP server running on stdio');
    }

}


const server = new ImageNServer();
server.run().catch(console.error);

