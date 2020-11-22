<p align="center">
  <img src="demo.gif" alt="animated">
</p>
<br/>
<br/>

# *G*itlab *R*elease *R*emover *UI* - GRRU

## Why
Currently as of this writing, [Gitlab doesn't provide a way on the UI to remove releases inside a project](https://gitlab.com/gitlab-org/gitlab/-/issues/213862) (not yet), this extension aims to fix that.

## Usage
Download latest version, extract it, open Chrome and point to "chrome://extensions"
1. Tick "Developer mode"
2. Load unpacked
3. Point to the inside of the extracted folder.
## How it works
Because the nature of extension is just executing script as if it's coming from that page, basically it has control over all things - and the session cookie is not an exception.

It uses the Release API provided by Gitlab and the signed-in user's session cookie to make a request call, only certain member's role can see the remove button.

## License
Distributed under the MIT License. See [LICENSE](/LICENSE) for more information.

## Contact
Dao Tuan - [tuand@dwarvesv.com](mailto:tuand@dwarvesv.com)
