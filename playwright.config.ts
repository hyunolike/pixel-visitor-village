import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'tests',workers:2,use:{baseURL:'http://127.0.0.1:4178',channel:'chrome',viewport:{width:1024,height:900},trace:'retain-on-failure'},webServer:{command:'pnpm preview',url:'http://127.0.0.1:4178',reuseExistingServer:false},reporter:'list'});
