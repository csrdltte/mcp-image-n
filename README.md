
# mcp-image-n

An MCP (Model Context Protocol) server for image operations using ImageMagick

### Inspired on

[AeyeOps/mcp-imagemagick](https://github.com/AeyeOps/mcp-imagemagick)



### License

MIT License - see LICENSE file for details.

### Security Considerations

This project inherits security considerations from ImageMagick. Please be aware:

- **ImageMagick processes many file formats**, some of which can contain malicious payloads
- **Always process images from trusted sources** when possible
- **Check your ImageMagick security policy** (`policy.xml`) is properly configured
- **Consider running with limited permissions** in production environments

For detailed security information, see [SECURITY.md](SECURITY.md) and [ImageMagick's Security Policy](https://imagemagick.org/script/security-policy.php).

### Third-Party Software

This project uses the following third-party software:

#### ImageMagick
- Copyright © 1999 ImageMagick Studio LLC
- Licensed under the ImageMagick License
- License: https://imagemagick.org/script/license.php
- Used for image conversion operations


Note: This project calls these tools via their command-line interfaces and does not distribute or incorporate their source code.
