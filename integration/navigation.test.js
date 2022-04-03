// yarn jest --config integration/jest.config.mjs
const baseUrl = 'http://localhost:3000';

test('registration, login, matching, open chat, logout, delete user', async () => {
  // navigate to landing page
  await page.goto(`${baseUrl}/`);
  expect(page.url()).toBe(`${baseUrl}/`);
  await expect(page).toMatch('Buddies');
  // go to registration
  await expect(page).toClick('[data-test-id="register"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/register`);
  await expect(page).toMatch('Sign up');

  // fill out the registration
  await expect(page).toFill('[data-test-id="username"]', 'Katharina');
  await expect(page).toFill('[data-test-id="bio"]', 'Web Developer');
  await expect(page).toClick('[data-test-id="activities-1"]');
  await expect(page).toClick('[data-test-id="activities-2"]');
  await expect(page).toClick('[data-test-id="activities-3"]');
  await expect(page).toClick('[data-test-id="activities-4"]');
  await expect(page).toClick('[data-test-id="avatar"]');
  await expect(page).toFill('[data-test-id="email"]', 'example@mail.com');
  await expect(page).toFill('[data-test-id="password"]', 'password');

  // submit form and be redirected to dashboard
  await expect(page).toClick('[data-test-id="register"]');
  await page.waitForNavigation();
  await expect(page).toMatch('Welcome back, Katharina');

  // open dropdown menu and log out
  await expect(page).toClick('[data-test-id="openMenu"]');
  await expect(page).toClick('[data-test-id="logout"]');
  await page.waitForNavigation();
  await expect(page.url()).toBe(`${baseUrl}/`);
  await expect(page).toMatch('Buddies');

  // navigate to registration page
  await expect(page).toClick('[data-test-id="register"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/register`);
  await expect(page).toMatch('Sign up');

  // fill out the registration
  await expect(page).toFill('[data-test-id="username"]', 'Lena');
  await expect(page).toFill('[data-test-id="bio"]', 'Coach');
  await expect(page).toClick('[data-test-id="activities-1"]');
  await expect(page).toClick('[data-test-id="activities-2"]');
  await expect(page).toClick('[data-test-id="activities-3"]');
  await expect(page).toClick('[data-test-id="activities-4"]');
  await expect(page).toClick('[data-test-id="avatar"]');
  await expect(page).toFill('[data-test-id="email"]', 'example@mail.com');
  await expect(page).toFill('[data-test-id="password"]', 'password');

  // submit, there should be an error message, change email
  await expect(page).toClick('[data-test-id="register"]');
  await page.waitForTimeout(4000);
  await expect(page).toMatch(
    'A profile with this email address already exists.',
  );
  await expect(page).toFill('[data-test-id="email"]', 'example@email.at');

  // submit form and be redirected to dashboard
  await expect(page).toClick('[data-test-id="register"]');
  await page.waitForNavigation();
  await expect(page).toMatch('Welcome back, Lena');

  // go to matches
  await expect(page).toClick('[data-test-id="matches"]');
  await page.waitForNavigation();
  await expect(page).toMatch('Matches');
  await expect(page).toMatch('Katharina');

  // open chat options and start a new chat
  await expect(page).toClick('[data-test-id="chatOptions"]');
  await page.waitForTimeout(2000);
  await expect(page).toFill('[data-test-id="chatName"]', 'test chat');
  await expect(page).toClick('[data-test-id="chat-with-Katharina"]');
  await expect(page).toClick('[data-test-id="createChat"]');

  // be redirected to a chat page
  await page.waitForNavigation();
  await expect(page).toMatch('test chat');

  // write a message, see it appear on page
  // await expect(page).toFill('[data-test-id="chatText"]', 'Hi there!');
  // await expect(page).toClick('[data-test-id="sendMessage"]');
  // await page.waitForTimeout(5000);
  // await expect(page).toMatch('Hi there!');

  // delete chat
  await expect(page).toClick('[data-test-id="delete-chat"]');
  await page.waitForTimeout(2000);
  await expect(page).toMatch(
    `Are you sure you want to permanently delete this chat`,
  );
  await expect(page).toClick('[data-test-id="delete"]');

  // be redirected to matches and go to edit profile
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/matches`);
  await expect(page).toClick('[data-test-id="openMenu"]');
  await page.waitForTimeout(2000);
  await expect(page).toClick('[data-test-id="edit"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/profile`);
  await expect(page).toMatch('Edit profile');

  // delete user 'Lena' and be redirected to goodbye page
  await expect(page).toClick('[data-test-id="delete-user"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/goodbye`);
  await expect(page).toMatch('All the best for your future adventures!');

  // go back to the home page, then to login
  await expect(page).toClick('[data-test-id="back-to-home"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/`);
  await expect(page).toMatch('Buddies');
  await expect(page).toClick('[data-test-id="login"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/login`);
  await expect(page).toMatch('Sign in');

  // log in as 'Katharina'
  await expect(page).toFill('[data-test-id="email"]', 'example@mail.com');
  await expect(page).toFill('[data-test-id="password"]', 'wrongPW');
  await expect(page).toClick('[data-test-id="login"]');
  // error for wrong pw
  await page.waitForTimeout(3000);
  await expect(page).toMatch('Login information incorrect');
  // correct the pw, be redirected to dashboard
  await expect(page).toFill('[data-test-id="password"]', 'password');
  await expect(page).toClick('[data-test-id="login"]');
  await page.waitForNavigation();

  // be redirected to dashboard and go to edit profile
  await expect(page).toMatch('Welcome back, Katharina');
  await expect(page).toClick('[data-test-id="openMenu"]');
  await page.waitForTimeout(2000);
  await expect(page).toClick('[data-test-id="edit"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/profile`);
  await expect(page).toMatch('Edit profile');

  // delete user 'Katharina' and be redirected to goodbye page
  await expect(page).toClick('[data-test-id="delete-user"]');
  await page.waitForNavigation();
  expect(page.url()).toBe(`${baseUrl}/goodbye`);
  await expect(page).toMatch('All the best for your future adventures!');
});
