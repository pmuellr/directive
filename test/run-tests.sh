#!/bin/sh

cd `dirname $0`


node test-all.js

#-----------------------------------------------------------------------------
# build HTML tests
#-----------------------------------------------------------------------------

mkdir  ../tmp
rm -rf ../tmp/*

cp -R * ../tmp
cp ../directive.js ../tmp
module2transportd -o ../tmp --htmlFile test-driver.html --htmlMain 'require("test-all")' ../tmp

cp ../../modjewel/modjewel-require.js ../tmp
