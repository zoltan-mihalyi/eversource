import * as fs from 'fs';
import * as marked from 'marked';
import * as checker from 'license-checker';

export async function convert(content: Buffer, path: string): Promise<string | Buffer> {
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
    const mdText = content.toString('utf-8');

    const softwareLicenses = await getSoftwareLicenses();

    return marked(mdText + softwareLicenses, { renderer });
}

function readLicenses(): Promise<checker.ModuleInfos> {
    console.log('Reading licenses...');
    return new Promise<checker.ModuleInfos>((resolve, reject) => {
        checker.init({
            start: '.',
            production: true,
        }, function (err, packages) {
            if (err) {
                reject(err);
            } else {
                resolve(packages);
            }
        });

    })
}

async function getSoftwareLicenses(): Promise<string> {
    const licenses = await readLicenses();
    console.log('Processing licenses...');

    const rows: string[] = [];

    for (const key of Object.keys(licenses)) {
        const license = licenses[key];
        if (key.indexOf('eversource@') !== -1) {
            continue;
        }

        let licenseText;
        if (license.licenseFile!.indexOf('README') === -1) {
            licenseText = await new Promise<string>((resolve, reject) => {
                fs.readFile(license.licenseFile!, 'utf-8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }

        const licenseSummary = `License (${license.licenses})`;


        rows.push('');
        rows.push('');
        rows.push(`## ${key.replace(/@/g, '\\@')}`);
        rows.push('');

        if (licenseText) {
            rows.push('<details>');
            rows.push(`<summary>${licenseSummary}</summary>`);
            rows.push(licenseText);
            rows.push('</details>');
        } else {
            rows.push(licenseSummary);
        }
    }

    return rows.join('\n');
}