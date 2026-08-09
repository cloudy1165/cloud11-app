/**
 * OpenAPI 3.0 specification for the Cloud11 Notes API.
 * Used by swagger-jsdoc to generate the spec and swagger-ui-express to serve /api/docs.
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cloud11 Notes API',
    version: process.env.APP_VERSION || '1.0.0',
    description:
      'A simple REST API for managing notes. Built as the sample application for the Cloud11 IBM Internship CI/CD pipeline demo.',
    contact: {
      name: 'Cloud11 Team',
      url: 'https://github.com/cloudy1165/cloud11-app',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
    {
      url: 'https://ghcr.io/cloudy1165/cloud11-app',
      description: 'GHCR image (run locally via Docker Compose)',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health and metadata' },
    { name: 'Notes', description: 'CRUD operations on notes' },
  ],
  components: {
    schemas: {
      Note: {
        type: 'object',
        required: ['title'],
        properties: {
          id: { type: 'integer', example: 1, readOnly: true },
          title: { type: 'string', example: 'Setup CI/CD Pipeline', maxLength: 500 },
          completed: { type: 'boolean', example: false, default: false },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Note not found' },
        },
      },
      Health: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'integer', example: 42, description: 'Seconds since start' },
          version: { type: 'string', example: '1.0.0' },
          node: { type: 'string', example: 'v20.11.0' },
          memory: {
            type: 'object',
            properties: {
              rss: { type: 'string', example: '58 MB' },
              heapUsed: { type: 'string', example: '9 MB' },
              heapTotal: { type: 'string', example: '12 MB' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns service status, uptime, Node.js version, and memory usage.',
        operationId: 'getHealth',
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Health' } } },
          },
        },
      },
    },
    '/api/version': {
      get: {
        tags: ['Health'],
        summary: 'Version info',
        operationId: 'getVersion',
        responses: {
          200: {
            description: 'App version and runtime info',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: { type: 'string', example: '1.0.0' },
                    environment: { type: 'string', example: 'production' },
                    uptime: { type: 'integer', example: 120 },
                    node: { type: 'string', example: 'v20.11.0' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/notes': {
      get: {
        tags: ['Notes'],
        summary: 'List all notes',
        operationId: 'getNotes',
        responses: {
          200: {
            description: 'Array of notes',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Notes'],
        summary: 'Create a note',
        operationId: 'createNote',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Write unit tests' },
                  completed: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Note created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
          400: {
            description: 'Missing title',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/api/notes/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Note ID',
        },
      ],
      get: {
        tags: ['Notes'],
        summary: 'Get a single note',
        operationId: 'getNoteById',
        responses: {
          200: {
            description: 'Note found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
          404: {
            description: 'Note not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
      put: {
        tags: ['Notes'],
        summary: 'Update a note',
        operationId: 'updateNote',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Note updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
          404: {
            description: 'Note not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
      delete: {
        tags: ['Notes'],
        summary: 'Delete a note',
        operationId: 'deleteNote',
        responses: {
          204: { description: 'Note deleted' },
          404: {
            description: 'Note not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;
