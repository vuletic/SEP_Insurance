# SEP Insurance
The main goal of this application is to allow customers to purchase insurance online. The second important feature enables customers to quickly check insurance price.

For calculating insurance prices the application uses a rule engine.

The application's payment system is connected to [PayPal](https://www.paypal.com/us/webapps/mpp/about). When a customer wants to pay his insurance policy he gets redirected to PayPal's site, where he can safely finish the purchase.

In the end the customer receives an e-mail from the application, describing the outcome of it's purchase.

To take a look at our application, visit [https://seposiguranje.azurewebsites.net/](https://seposiguranje.azurewebsites.net)

## Motivation
This web application is created as a university project for the Electronic Payment Systems course. It unites best coding practices, implements effective security measures and database design. For executing business rules the application uses a rule engine. Everything is covered by appropriate tests.

## Installation
###Prerequisites:
- Installed IIS server, turned on in "Turn Windows Features On and Off"
- MSBuild path set in "Environment Variables"

- Installed Java 1.8
- Java path set in "Environment Variables"
- Installed Maven
- Maven path set in "Environment Variables"

- Installed Node.js
- (if not by default) npm path set in "Environment Variables"
- gulp-cli installed globally

- Installed Mongodb
- Installed Robomongo

### Procedure for downloading:
- Go to: (http://kinolien.github.io/gitzip/) - a tool for downloading specific github repository subdirectories
- Paste url of One click deploy directory: (https://github.com/vuletic/SEP_Insurance/tree/br/OCD) and click Download
- Unzip the directory

### Setting Mongodb:
- Run Mongodb
- From Robomongo, connect to localhost:27017
- Add database named "l10nDB" with directory
- To "l10nDB" database add collection named "languages"
- Add two JSON objects, which you can find in unzipped folder, under the "l10n objects"

### Deploying the set of applications:
- Run "Command Prompt" as admin user
- Change directory of CMD to unzipped folder
- Run "deploy.bat"

## Running tests

###Prerequisites
- Installed karma-cli globally ( if it is not run: npm install -g karma-cli )

###Running tests
- Open terminal in the Content/Angular folder
- If not already done, run: npm install
- Run: karma start tests/karma.conf.js

## Linked repositories
+ [Rule engine repository](https://github.com/nenadTod/RulesAPI) - used to describe and execute business rules
+ [Localisation repository](https://github.com/nenadTod/l10nAPI) - used to provide localization objects

## Authors
+ Nenad Todorović - [nenadTod](https://github.com/nenadTod)
+ David Vuletić - [vuletic](https://github.com/vuletic)
+ Nemanja Miladinović - [NNemanjaMM](https://github.com/NNemanjaMM)

## Additional info
For more information see this repository's [wiki page](https://github.com/vuletic/SEP_Insurance/wiki).

## Licence
This project is licensed under the  terms of the MIT License - for more information take a look at [this page](https://opensource.org/licenses/MIT) 
