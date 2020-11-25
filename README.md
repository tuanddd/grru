<p align="center">
  <img src="demo.gif" alt="animated">
</p>
<br/>
<br/>

# *G*itlab *R*elease *R*emover *UI* - GRRU

## Why
Currently as of this writing, [Gitlab doesn't provide a way on the UI to remove releases inside a project](https://gitlab.com/gitlab-org/gitlab/-/issues/213862) (not yet), this extension aims to fix that.

* Zero dependencies
* Zero configuration
* Works on any Gitlab sites whether gitlab.com or self-managed instances

## Usage
Download latest version, extract it, open Chrome and point to "chrome://extensions"
1. Tick "Developer mode"
2. Load unpacked
3. Point to the inside of the extracted folder.
## How it works
Because the nature of extension is just executing script as if it's coming from that page, basically it has control over all things - and the session cookie is not an exception.

It uses the Release API provided by Gitlab and the signed-in user's session cookie to make a request call

## Roadmap
Assuming that Gitlab still haven't released their official UI yet:
1. [x] Remove release
2. [x] Scope action to certain member roles 
3. [ ] Show nice error notification if fails
4. [ ] Undo within e.g 10 secs

## License
Distributed under the MIT License. See [LICENSE](/LICENSE) for more information.

## Contact
Dao Tuan - [tuand@dwarvesv.com](mailto:tuand@dwarvesv.com)
