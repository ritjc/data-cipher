# data-cipher
  Encrypt/decrypt data using aes-192-cbc algorithm

# features
* AES-192-CBC (cipher algorithm)
* Encrypt/decrypt string
* Encrypt/decrypt file


# Installation

```sh
  npm install data-cipher
```
or to use it via command-line
```
  npm install data-cipher -g
```

# usage / examples

## cli
To check the help section:
```sh
data-cipher -h
```
### Encrypt/decrypt string

```javascript
  const {stringEncrypted, stringDecrypted} = require('data-cipher')
  const passphrase = "this is a test passphrase"

  stringEncrypted('this is a test data', passphrase).then(console.log)
  // 7f834dd1f2f044f81bb672f0c4e4e8ec05f0e249a4866effe9877418cd3122c22c0d43db5f63dfc2cae457a4df9136ed

  stringDecrypted('7f834dd1f2f044f81bb672f0c4e4e8ec05f0e249a4866effe9877418cd3122c22c0d43db5f63dfc2cae457a4df9136ed',passphrase).then(console.log)
  // this is a test data

```

cli
```sh
data-cipher encrypt -i 'this is a test data' -t string -p 'this is a test passphrase'
# 7f834dd1f2f044f81bb672f0c4e4e8ec05f0e249a4866effe9877418cd3122c22c0d43db5f63dfc2cae457a4df9136ed

data-cipher decrypt -i '7f834dd1f2f044f81bb672f0c4e4e8ec05f0e249a4866effe9877418cd3122c22c0d43db5f63dfc2cae457a4df9136ed' -t string -p 'this is a test passphrase'
# this is a test data
```

### Encrypt/decrypt file

```javascript
  const path = require('path')
  const { fileEncrypted, fileDecrypted } = require('data-cipher')
  const passphrase = "this is a test passphrase"


  //  **/text.txt -> **/text.txt.enc -> **/text.txt.dec
  ;(async () => {
    // encrypted file
    // fileEncrypted(src, pwd, dest)
    await fileEncrypted(
      path.resolve(__dirname, './test.txt'),
      passphrase,
      path.resolve(__dirname, './test.txt.enc')
    )

    // decrypted file
    // fileDecrypted(src, pwd, dest)
    await fileDecrypted(
      path.resolve(__dirname, './test.txt.enc'),
      passphrase,
      path.resolve(__dirname, './test.txt.dec')
    )
  })()

```
cli
```sh
# encrypted file
data-cipher encrypt -i ./test.txt -o ./test.txt.enc -t file -p 'this is a test passphrase'

# decrypted file
data-cipher decrypt -i ./test.txt.enc -o ./test.txt.dec -t file -p 'this is a test passphrase'
```