# How to encrypt files with [SOPS](https://github.com/mozilla/sops) and [Age](https://github.com/FiloSottile/age)

## Generate key pair

```
age-keygen -o key.txt
```

## Encrypt file

```
sops --encrypt \
        --age <public-key-from-the-generated-key-pair> \
        --encrypted-regex '^(data)$' \
        secret.yaml > secret.enc.yaml
```

## Decrypt file

```
# Add key file env variable for key pair path
$ export SOPS_AGE_KEY_FILE=$(pwd)/key.txt

# This command will use the env variable path and decrypt it
$ sops --decrypt secret.enc.yaml > secret.yaml

# Or you can apply a secret yaml via piping directly, helps avoid creating plain secret.yaml file:
$ sops --decrypt secret.enc.yaml | kubectl apply -f -
```
