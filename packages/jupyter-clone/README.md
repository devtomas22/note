# Jupyter Clone

A Jupyter Notebook clone built using React and the `@deepnote/blocks` package. This web application provides a familiar Jupyter-like interface for creating and executing notebooks with code and markdown cells.

## Features

- **Jupyter-like Interface**: Classic Jupyter Notebook look and feel
- **Code Cells**: Execute Python code with syntax highlighting
- **Markdown Cells**: Rich text documentation with markdown support
- **Cell Management**: Add, delete, move cells up/down
- **Keyboard Shortcuts**: Familiar Jupyter keyboard shortcuts
- **Cell Execution**: Run individual cells or all cells
- **Output Display**: View execution results, stdout, and errors
- **Notebook Management**: Save and load notebooks
- **Kernel Status**: Real-time kernel status indicator

## Architecture

### Frontend (React)

The application is built with React and TypeScript, providing a responsive and interactive notebook interface.

**Key Components:**

- `App.tsx` - Main application container, manages notebook state
- `NotebookToolbar.tsx` - Toolbar with notebook actions
- `Cell.tsx` - Individual cell component (code or markdown)
- `backend-api.ts` - API client for kernel communication

### Backend (Hypothetical)

The application is designed to work with a Jupyter-compatible backend server. While this demo includes simulated execution, a production deployment would connect to:

#### Option 1: Jupyter Kernel Gateway

[Jupyter Kernel Gateway](https://jupyter-kernel-gateway.readthedocs.io/) provides a REST API and WebSocket interface for Jupyter kernels.

**Setup:**

```bash
pip install jupyter_kernel_gateway
jupyter kernelgateway --port=8888
```

**Endpoints:**

- `POST /api/kernels` - Start a new kernel
- `GET /api/kernels/{kernel_id}` - Get kernel status
- `DELETE /api/kernels/{kernel_id}` - Shutdown kernel
- `WS /api/kernels/{kernel_id}/channels` - WebSocket for kernel communication

#### Option 2: JupyterLab Server

[JupyterLab](https://jupyterlab.readthedocs.io/) provides a full-featured notebook server.

**Setup:**

```bash
pip install jupyterlab
jupyter lab --port=8888 --ServerApp.disable_check_xsrf=True
```

**API Endpoints:**

- `/api/kernels` - Kernel management
- `/api/sessions` - Session management
- `/api/contents` - Notebook file operations

#### Option 3: Custom Backend

Build a custom backend using:

- **Python**: `jupyter_client` library for kernel management
- **Node.js**: `node-kernel` or similar packages
- **Any language**: Implement Jupyter messaging protocol

### Communication Protocol

The application uses the [Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html):

**Message Types:**

- `execute_request` - Execute code
- `execute_reply` - Execution results
- `stream` - stdout/stderr output
- `display_data` - Rich display output
- `error` - Execution errors

**WebSocket Message Format:**

```json
{
  "header": {
    "msg_id": "uuid",
    "msg_type": "execute_request",
    "username": "user",
    "session": "session_id"
  },
  "parent_header": {},
  "metadata": {},
  "content": {
    "code": "print('Hello, World!')",
    "silent": false,
    "store_history": true
  }
}
```

## Getting Started

### Prerequisites

- Node.js >= 22.14.0
- pnpm >= 10.17.1

### Installation

```bash
# From the repository root
pnpm install

# Navigate to the jupyter-clone package
cd packages/jupyter-clone

# Install dependencies
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Usage

### Keyboard Shortcuts

- `Shift + Enter` - Run cell and select below
- `Ctrl + Enter` - Run cell and stay
- `Alt + Enter` - Run cell and insert below
- `Ctrl + S` - Save notebook

### Cell Operations

**Code Cells:**

1. Click in a cell to edit
2. Type Python code
3. Press `Shift + Enter` to execute
4. View output below the cell

**Markdown Cells:**

1. Double-click to edit
2. Type markdown content
3. Click outside to render

**Cell Management:**

- Click `+ Code` or `+ Markdown` in toolbar to add cells
- Use arrow buttons (↑ ↓) to move cells
- Click trash icon (🗑) to delete cells

## Configuration

### Backend URL

The backend API URL can be configured in `backend-api.ts`:

```typescript
const backendAPI = new JupyterBackendAPI("http://localhost:8888");
```

### Kernel Settings

Default kernel is Python 3. To change:

```typescript
// In App.tsx
metadata: {
  kernelspec: {
    name: 'python3',    // Kernel name
    language: 'python', // Language
  },
}
```

## Deployment

### Development Environment

For local development, use the simulated backend (included):

```bash
pnpm dev
```

### Production with Jupyter Kernel Gateway

1. Install and start Jupyter Kernel Gateway:

```bash
pip install jupyter_kernel_gateway
jupyter kernelgateway --port=8888 --KernelGatewayApp.allow_origin='*'
```

2. Build and serve the frontend:

```bash
pnpm build
pnpm preview
```

### Production with Custom Backend

1. Implement the backend API following the interface in `backend-api.ts`
2. Configure CORS to allow frontend requests
3. Update the backend URL in the configuration
4. Deploy frontend and backend separately

### Docker Deployment

Example `Dockerfile` for backend:

```dockerfile
FROM python:3.11-slim

RUN pip install jupyter_kernel_gateway

EXPOSE 8888

CMD ["jupyter", "kernelgateway", "--port=8888", "--ip=0.0.0.0", "--KernelGatewayApp.allow_origin='*'"]
```

Example `docker-compose.yml`:

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "8888:8888"

  frontend:
    build: ./packages/jupyter-clone
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=http://backend:8888
    depends_on:
      - backend
```

## Security Considerations

### Production Deployment

For production use, implement:

1. **Authentication**: Add user authentication (JWT, OAuth, etc.)
2. **Authorization**: Restrict kernel and file access per user
3. **Rate Limiting**: Prevent abuse of execution endpoints
4. **Input Validation**: Sanitize code input and outputs
5. **HTTPS**: Use TLS for all communications
6. **Sandboxing**: Run kernels in isolated containers
7. **Resource Limits**: Set CPU, memory, and execution time limits

### CORS Configuration

Configure CORS appropriately:

```python
# Jupyter Kernel Gateway
jupyter kernelgateway \
  --KernelGatewayApp.allow_origin='https://yourdomain.com' \
  --KernelGatewayApp.allow_credentials=True
```

## Known Limitations

This is a demonstration implementation with:

- Simulated code execution (no real kernel connection in demo)
- Basic markdown rendering (no full markdown support)
- No file upload/download
- No rich output types (images, HTML, etc.)
- No collaborative editing
- No cell history or undo/redo

For production use, these features should be implemented.

## Future Enhancements

- [ ] Rich output rendering (images, plots, HTML)
- [ ] Multiple kernel support (R, Julia, etc.)
- [ ] File browser and management
- [ ] Cell history and undo/redo
- [ ] Autocomplete and IntelliSense
- [ ] Debugger integration
- [ ] Extensions and plugins
- [ ] Collaborative editing
- [ ] Git integration
- [ ] Cloud storage integration

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

Apache-2.0 - see [LICENSE](../../LICENSE) for details.

## Related Projects

- [Deepnote Blocks](../blocks) - Core block types and utilities
- [Deepnote Convert](../convert) - Jupyter to Deepnote converter
- [Jupyter](https://jupyter.org/) - Original Jupyter project
- [JupyterLab](https://jupyterlab.readthedocs.io/) - Next-generation Jupyter interface
- [nteract](https://nteract.io/) - Desktop notebook application

## Support

For issues and questions:

- [GitHub Issues](https://github.com/deepnote/deepnote/issues)
- [Community Discussions](https://github.com/deepnote/deepnote/discussions)
