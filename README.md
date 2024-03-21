# Merchant Center - Custom Products

## Guideline 

### Sandbox
[Sandbox](https://mc.australia-southeast1.gcp.commercetools.com)
Note: This is only the sandbox for merchant center, the custom application can only run in the local machine at the moment 

### Setup local environment
**Prerequisite:** Install Git, NPM, node in your local machine 

Clone the project using terminal 
```sh
git clone https://github.com/HoangLongEpam/dksh-custom-products.git
```
Navigate to the project folder 
```sh
cd dksh-custom-products
```
Install dependencies (We have to run install force due to some dependencies conflict coming from the commercetool template)
```sh
npm install --force
```
Start the application (If it take too long, please cancel and run again, this is due to first build problem)
```sh
npm run start 
```