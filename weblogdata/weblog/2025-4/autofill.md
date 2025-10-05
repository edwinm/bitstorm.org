---
title: "Autofill with the autocomplete attribute"
date: 2025-04-12T09:06
tags: featured
---

You probably know this: some registration forms are completed in no time, while others are a tedious process in which you have to manually enter your phone number, address, etc.

The first type will probably use autofill, with the `autocomplete` attribute.
Autofill allows a browser to automatically fill in form fields.
Using autofill makes filling in forms easier, safer, and increases the conversion rate.

You can turn on autofill by setting `autocomplete` to `on`.

```html
<input type="text" name="name" autocomplete="on">
```

But that is not the best way. Usually `autocomplete` is already set to `on` by default, and the browser has to guess
what exactly needs to be filled in.
It is better to give `autocomplete` a specific value, such as `given-name` for name.

```html
<input type="text" name="name" autocomplete="given-name">
```

In addition to tel for phone number, there are many more possible values for various form fields. This is the entire list:

<pre style="columns: 4">
name
honorific-prefix
given-name
additional-name
family-name
honorific-suffix
nickname
organization-title
username
new-password
current-password
one-time-code
organization
street-address
address-line1
address-line2
address-line3
address-level4
address-level3
address-level2
address-level1
country
country-name
postal-code
cc-name
cc-given-name
cc-additional-name
cc-family-name
cc-number
cc-exp
cc-exp-month
cc-exp-year
cc-csc
cc-type
transaction-currency
transaction-amount
language
bday
bday-day
bday-month
bday-year
sex
url
photo
tel
tel-country-code
tel-national
tel-area-code
tel-local
tel-local-prefix
tel-local-suffix
tel-extension
email
impp
</pre>

A number of fields, such as `name`, `street-address`, `cc-name`, `cc-exp`, `bday` and `tel` can be split into smaller parts.
For example, instead of `bday` (birthday), you can also use three separate input fields with `bday-day`, `bday-month` and `bday-year`.

Besides `<input>`, you can also use the `autocomplete` attribute on `<textarea>` and `<select>`.

## Disable Autofill

You can also disable autofill. For example, for an input field that is different every time, such as a 2FA token.
You then use the value `off`.

```html
<input type="text" name="2fa-token" autocomplete="off">
```

Make sure you do not disable autofill for all fields.
About ten years ago, the Chrome team noticed that autofill was completely disabled for a number of forms
even though there was no good reason for this. They then chose to ignore the `autocomplete` attribute in that case.

See the accompanying bug report and the discussion here: [autocomplete=off is ignored on non-login INPUT elements](https://issues.chromium.org/issues/41163264).

## Extra tokens

The `autocomplete` attribute can contain multiple tokens.
For example, you can add `shipping` or `billing`, for example in an order form to
specify the shipping address and the billing address separately.

```html
<textarea name="address" autocomplete="shipping street-address"></textarea>
```

To indicate what kind of phone number, email or impp address it is, you can add one of these tokens:
`home`, `work`, `mobile`, `fax` or `pager`.

```html
<input type="tel" name="phone" autocomplete="work tel">
```

As a final extra token you can specify a section, with which you can group and distinguish input fields.
Suppose you give the possibility that a visitor can buy a concert ticket for a friend,
then you can distinguish the buyer's and friend's data with the tokens `section-buyer` and `section-friend`.
The section token always starts with `section-` and what comes after that you can think of yourself and only serves to distinguish,
it has no substantive value for the browser.

```html
<fieldset>
 <legend>Buyer</legend>
 <label for="name-buyer">Name</label>
 <input type="text" id="name-buyer" name="name-buyer" autocomplete="section-buyer name">
 <label for="email-buyer">Email</label>
 <input type="email" id="email-buyer" name="email-buyer" autocomplete="section-buyer email">
</fieldset>

<fieldset>
 <legend>Friend</legend>
 <label for="name-friend">Name</label>
 <input type="text" id="name-friend" name="name-friend" autocomplete="section-friend name">
 <label for="email-friend">Email</label>
 <input type="email" id="email-friend" name="email-friend" autocomplete="section-friend email">
</fieldset>
```

## Order of tokens

The specification defines the order of the tokens. This is the order:

- section-*
- shipping or billing
- In case of tel*, email or impp: home, work, mobile, fax or pager
- An autofill field name like name, street-address, cc-name, cc-exp, bday etcetera.

Only the autofill field name is mandatory. The other tokens are optional.

Here is an example of a form with the correct order of the tokens:

```html
<input type="email" name="email" autocomplete="section-customer billing work email">
```

## Passwords

Good passwords are not easy to guess and are different for each website and service.
Nowadays we use so many websites and services that it is unrealistic to expect us to come up with and remember a difficult password for every
website and service.

That is why a password manager is [recommended](https://www.ncsc.gov.uk/collection/passwords/password-manager-buyers-guide).
Most browsers have one built in, but even more convenient is a
separate password manager such as 1Password, Bitwarden or Keeper.

In combination with the right autofill attributes, signing up, logging in and renewing a password becomes very easy.

This is in contrast to poorly made sites where you have to come up with a difficult password yourself that you have to enter again in the next
step. That is not nice if you want to buy a parking ticket or are at the checkout and your password
turns out to have expired or been reset.

How do you do that properly? For the current password, use the `autocomplete` value `current-password`
and where you can enter a new password, use `new-password`.
The password manager will then create a strong password, remember it and fill it in the next time.

Example to log in:

```html
<label for="username">User name</label>
<input type="text" id="username" name="username" autocomplete="username">
<label for="password">Password</label>
<input type="password" id="password" name="password" autocomplete="current-password">
```

Example to enter a new password:

```html
<label for="password">Password</label>
<input type="password" id="password" name="password" autocomplete="new-password">
<label for="password-confirm">Confirm password</label>
<input type="password" id="password-confirm" name="password-confirm" autocomplete="new-password">
```

## Password rules

You may be working with (old) backend systems that can't handle the autogenerated passwords
and require certain other rules that the password must adhere to.

This can be solved in part with `passwordrules`. You can use it to specify a minimum and maximum length and which characters may and may not appear in the password.
For now, this is only supported by Safari and the 1Password password manager.

[Password Rules Validation Tool](https://developer.apple.com/password-rules/)

Mozilla (from Firefox) says it [does not support](https://mozilla.github.io/standards-positions/#passwordrules-attribute).
Instead, they propose [validation with the pattern attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password#validation).

Unfortunately, this only works if you type in a password and not if you use a password manager to generate a password
and not even if you let Firefox generate a password itself.

In the meantime, a [proposal was made to WHATWG](https://github.com/whatwg/html/issues/3518) in 2018 to add `passwordrules`
to HTML, but it never got past the proposal stage.

## One time code

You probably know it: you want to log in somewhere and you have to type a code from an SMS into a form.
You can remember the code and type it in or you can use copy-paste, but it is cumbersome either way.
One time code (also known as OTP, one time password) is a solution for this.
Use the `autocomplete` value `one-time-code` for this and add an extra line to the SMS and
the code is automatically filled in after the user confirms.

```html
<input type="text"
inputmode="numeric"
autocomplete="one-time-code"
name="otp">
```

Then send an SMS with @<domain name> #<otp> as the last line

```text
Your verification code is 123456.

@example.com #123456
```

The user will then be able to easily copy this code into the form.

Read [SMS OTP form best practices](https://web.dev/articles/sms-otp-form) for more information.

Without JavaScript this only works in Safari.
For Android you can use the [WebOTP JavaScript API](https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API).
See also [Verify a phone number on the desktop using the WebOTP API](https://developer.chrome.com/docs/identity/cross-device-webotp?hl=en).

## Testing

Autofill is very difficult to test automatically. Always test a form manually, in different browsers,
on different devices and with and without a password manager. Especially test whether the login and password reset work properly.

## Learn more

Want to know exactly how to use `autocomplete` values?
Then look at [MDN: HTML attribute: autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#token_list_tokens)
or in the [WHATWG HTML standard: Autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).