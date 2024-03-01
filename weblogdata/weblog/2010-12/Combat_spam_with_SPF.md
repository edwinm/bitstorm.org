---
title: "Combat spam with SPF"
date: 2010-12-09T22:11

---


	You might think: "combatting spam is all good and nice, but what has it to do with webdevelopment?". Well, many webdevelopers maintain internet domains and that's exactly where SPF takes place. SPF, which stands for Sender Policy Framework, is one of the better ways to get rid of spam.

	The idea behind SPF is simple: when an email is received, you can check whether the host sending the email is allowed to send an email coming from this email address. This works in two ways: first, a spam email send with your email address will be blocked and second, email that's really coming from you will not be marked as spam.

	So how can I make it work? First you have to collect all ip-addresses from which email is legitimately send. Usually it's just the address of the smtp server. If other servers like a webserver sends email and it's different from the smtp server, you might want to add its address as well. You also might want to explicitly block ip addresses. To block all (other) ip addresses, you can use "-all".

	You can prefix the following qualifiers to the addresses:


<table>
	<tbody>
		<tr>
			<td>
				+</td>
			<td>
				Pass</td>
			<td>
				Address is allowed. This is the default qualifier and can be omitted.</td>
		</tr>
		<tr>
			<td>
				-</td>
			<td>
				Fail</td>
			<td>
				Address is not allowed.</td>
		</tr>
		<tr>
			<td>
				~</td>
			<td>
				Softfail</td>
			<td>
				Use this to mark as not allowed during the transitioning process. The mail will be allowed but marked.</td>
		</tr>
		<tr>
			<td>
				?</td>
			<td>
				Neutral</td>
			<td>
				Unknown whether it's allowed or not.</td>
		</tr>
	</tbody>
</table>

<h2>Creating a simple DNS record</h2>


	To make clear the DNS record we are building is using SPF, we have to prefix the record with "v=spf1". So only allowing mail to be send from ip address 82.192.84.37 will give you this simple rule:

	
```text
v=spf1 ip4:82.192.84.37 ~all
```


	We start with ~all, so if we make a mistake, not all our mail will be marked as spam. If everything seems to work allright, we can change it to -all.

	Creating an SPF rule is one thing, adding it to the DNS is another. Usually you'll go the the control panel of your hosting provider, or, if you use a seperate DNS server, to the control panel of your DNS server. There should be an option to edit the DNS or the DNS zone. There you'll be able to add a DNS record.

	A DNS record consists of five fields. The first is the domain name. It can be "@" or your domain name with a "." at the end, like "bitstorm.org.". If you don't add the dot, it will be prepended to your hostname, so "www" will, in my case, become "www.bitstorm.org". But that's not the domain I use for my email, so I use "bitstorm.org.".

	The second field it the TTL (Time To Live) value, the time the value is valid. Usually it will be four hours or one day. The value is in seconds. Four hours is 14400 seconds and one day is 86400 seconds. The third field is always "IN" and the fourth field is "TXT", as a SPF record is a DNS text record.

	In the fifth and last field, we can enter the SPF rule. If you're using cPanel, you have to put the value between double quotes.

	
```text
bitstorm.org. 14400 IN TXT "v=spf1 ip4:82.192.84.37 -all"
```


	Save your changes and you're done.

	You'll probably want to check if everything is okay. If you have access to linux, you can use dig to view DNS records. To see the TXT records of bitstorm.org, you'll type "dig txt bitstorm.org".

	You can also use online tools like Geektools <a href="http://geektools.com/digtool.php">digtool</a> to get DNS records.

	The best place to check is where it happens: with real email. All email programs can show you the headers of an email. A valid email address from my domain will pass:

	
```text
Received-SPF: pass (google.com: domain of edwin@bitstorm.org designates 85.17.71.92 as permitted sender) client-ip=85.17.71.92;
Authentication-Results: mx.google.com; spf=pass (google.com: domain of edwin@bitstorm.org designates 85.17.71.92 as permitted sender) smtp.mail=edwin@bitstorm.org
```


	A spam email send from ip-address 186.8.36.165 will fail:

	
```text
Received-SPF: fail (google.com: domain of quensettaferrell@bitstorm.org does not designate 186.8.36.165 as permitted sender) client-ip=186.8.36.165;
Authentication-Results: mx.google.com; spf=hardfail (google.com: domain of quensettaferrell@bitstorm.org does not designate 186.8.36.165 as permitted sender) smtp.mail=quensettaferrell@bitstorm.org
```


	You will see google.com in the header because Gmail is used.

<h2>Including other ip-addresses</h2>


	If you're using Gmail to send email, then you have to add the ip addresses of Google too. But what happens if they change their ip-address, do you have to edit all your DNS entries?

	Fortunately, there is a solution for this. You can include the SPF records from other domains.

	For Gmail, you'll have to add <a href="http://www.google.com/support/a/bin/answer.py?answer=178723">include:_SPF.google.com</a> to your SPF record:

	
```text
v=spf1 ip4:82.192.84.37 include:_SPF.google.com -all
```


	Other email service providers will have a similar mechanism.

	If you have a lot of ip addresses from which mail is send and a lot of domains, you don't want to edit all DNS entries of all your domains if one ip address changes. Just make your own _spf domain with a SPF record and include it in the SPF records of all other domains.

	These are the DNS records I'm using right now:

	
```text
_SPF 14400 IN TXT "v=SPF1 ip4:82.192.84.37 ip4:85.17.71.92 ip4:80.57.38.140 include:_SPF.google.com"
bitstorm.org. 14400 IN TXT "v=SPF1 include:_SPF.bitstorm.org -all"
```


<h2>What about Sender ID?</h2>


	Sender ID is developed by Microsoft and very similar to SPF. Although a Sender ID DNS record starts with "spf2.0...", it is not the successor of SPF. It even violates the SPF specification. You can read more about <a href="http://www.openspf.org/SPF_vs_Sender_ID">SPF vs Sender ID</a>.

<h2>Problems</h2>


	If you use email forwarding, SPF will fail and your email will be rejected. There are two solutions to this. One is to add the ip address of the domain the email is forwarded from to the SPF DNS record. The second solution is to encapsulate the email in another, email with another, allowed email address.

<h2>More information</h2>


	If you want to know more about SPF, you can find lots of information on the <a href="http://www.openspf.org/">Sender Policy Framework website</a>.

	Besides all, ip4 and include, the SPF Record Syntax also supports a couple of other options. The full syntax can be read in the <a href="http://www.openspf.org/SPF_Record_Syntax">SPF Record Syntax</a>.

