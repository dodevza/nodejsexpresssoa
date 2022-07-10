# WARNING

These token should not be used in deployment environments

## Generating PEM files for Production Use

Install openssl "Installed by default with Git"

Generate a private key for signing jwt tokens

```bash
openssl genrsa -out privatekey.pem 2048
```

Generate a public key for verifying jwt tokens

```bash
openssl rsa -in privatekey.pem -out publickey.pem -pubout -outform PEM
```
