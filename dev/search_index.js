var documenterSearchIndex = {"docs":
[{"location":"#FilePathsBase.jl-1","page":"Home","title":"FilePathsBase.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"(Image: Build Status) (Image: codecov.io) (Image: ) (Image: )","category":"page"},{"location":"#","page":"Home","title":"Home","text":"FilePathsBase.jl provides a type based approach to working with filesystem paths in julia.","category":"page"},{"location":"#Intallation-1","page":"Home","title":"Intallation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"FilePathsBase.jl is registered, so you can to use Pkg.add to install it.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> Pkg.add(\"FilePathsBase\")","category":"page"},{"location":"#Getting-Started-1","page":"Home","title":"Getting Started","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Here are some common operations that you may want to perform with file paths.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"#=\nNOTE: We're loading our `/` operator for path concatenation into the currect scope, but non-path division operations will still fallback to the base behaviour.\n=#\njulia> using FilePathsBase; using FilePathsBase: /\n\njulia> cwd()\np\"/Users/rory/repos/FilePathsBase.jl\"\n\njulia> walkpath(cwd() / \"docs\") |> collect\n23-element Array{Any,1}:\n p\"/Users/rory/repos/FilePathsBase.jl/docs/.DS_Store\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/Manifest.toml\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/Project.toml\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/build\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/build/api.html\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/build/assets\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/build/assets/arrow.svg\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs/build/assets/documenter.css\"\n ...\n\njulia> stat(p\"docs/src/index.md\")\nStatus(\n  device = 16777223,\n  inode = 32240108,\n  mode = -rw-r--r--,\n  nlink = 1,\n  uid = 501 (rory),\n  gid = 20 (staff),\n  rdev = 0,\n  size = 2028 (2.0K),\n  blksize = 4096 (4.0K),\n  blocks = 8,\n  mtime = 2020-04-20T17:20:38.612,\n  ctime = 2020-04-20T17:20:38.612,\n)\n\njulia> relative(p\"docs/src/index.md\", p\"src/\")\np\"../docs/src/index.md\"\n\njulia> normalize(p\"src/../docs/src/index.md\")\np\"docs/src/index.md\"\n\njulia> absolute(p\"docs/src/index.md\")\np\"/Users/rory/repos/FilePathsBase.jl/docs/src/index.md\"\n\njulia> islink(p\"docs/src/index.md\")\ntrue\n\njulia> canonicalize(p\"docs/src/index.md\")\np\"/Users/rory/repos/FilePathsBase.jl/README.md\"\n\njulia> parents(p\"./docs/src\")\n2-element Array{PosixPath,1}:\n p\".\"\n p\"./docs\"\n\njulia> parents(absolute(p\"./docs/src\"))\n6-element Array{PosixPath,1}:\n p\"/\"\n p\"/Users\"\n p\"/Users/rory\"\n p\"/Users/rory/repos\"\n p\"/Users/rory/repos/FilePathsBase.jl\"\n p\"/Users/rory/repos/FilePathsBase.jl/docs\"\n\njulia> absolute(p\"./docs/src\")[1:end-1]\n(\"Users\", \"rory\", \"repos\", \"FilePathsBase.jl\", \"docs\")\n\njulia> tmpfp = mktempdir(SystemPath)\np\"/var/folders/vz/zx_0gsp9291dhv049t_nx37r0000gn/T/jl_1GCBFT\"\n\njulia> sync(p\"/Users/rory/repos/FilePathsBase.jl/docs\", tmpfp / \"docs\")\np\"/var/folders/vz/zx_0gsp9291dhv049t_nx37r0000gn/T/jl_1GCBFT/docs\"\n\njulia> exists(tmpfp / \"docs\" / \"make.jl\")\ntrue\n\njulia> m = mode(tmpfp / \"docs\" / \"make.jl\")\nMode(\"-rw-r--r--\")\n\njulia> m - readable(:ALL)\nMode(\"--w-------\")\n\njulia> m + executable(:ALL)\nMode(\"-rwxr-xr-x\")\n\njulia> chmod(tmpfp / \"docs\" / \"make.jl\", \"+x\")\n\"/var/folders/vz/zx_0gsp9291dhv049t_nx37r0000gn/T/jl_1GCBFT/docs/make.jl\"\n\njulia> mode(tmpfp / \"docs\" / \"make.jl\")\nMode(\"-rwxr-xr-x\")\n\n# Count LOC\njulia> mapreduce(+, walkpath(cwd() / \"src\")) do x\n           extension(x) == \"jl\" ? count(\"\\n\", read(x, String)) : 0\n       end\n3020\n\n# Concatenate multiple files.\njulia> str = mapreduce(*, walkpath(tmpfp / \"docs\" / \"src\")) do x\n           read(x, String)\n       end\n\"# API\\n\\nAll the standard methods for working with paths in base julia exist in the FilePathsBase.jl. The following describes the rough mapping of method names. Use `?` at the REPL to get the documentation and arguments as they may be different than the base implementations.\\n\\n...\"\n\n# Could also write the result to a file with `write(newfile, str)`)\n\njulia> rm(tmpfp; recursive=true)\n\njulia> exists(tmpfp)\nfalse","category":"page"},{"location":"design/#design_header-1","page":"Design","title":"Design","text":"","category":"section"},{"location":"design/#","page":"Design","title":"Design","text":"FilePaths.jl and FilePathsBase.jl have gone through several design iterations over the years. To help get potential contributors up-to-speed, we'll cover several background points and design choices. Whenever possible, we'll reference existing resources (e.g., GitHub issues, blog posts, documentation, software packages) for further reading.","category":"page"},{"location":"design/#Filesystem-Abstractions-1","page":"Design","title":"Filesystem Abstractions","text":"","category":"section"},{"location":"design/#","page":"Design","title":"Design","text":"While filesystems themselves are abstractions for data storage, many programming languages provide APIs for writing generic/cross-platform software. Typically, these abstractions can be broken down into string or typed based solutions.","category":"page"},{"location":"design/#String-APIs:-1","page":"Design","title":"String APIs:","text":"","category":"section"},{"location":"design/#","page":"Design","title":"Design","text":"Python: os.path\nHaskell: System.FilePath\nJulia: Base.Filesystem","category":"page"},{"location":"design/#","page":"Design","title":"Design","text":"This approach tends to be simpler and only requires adding utility methods for interacting with filesystems. Unfortunately, any operations require significant string manipulation to work, and it often cannot be extended for remote filesystems (e.g., S3, FTP, HTTP). Enforcing path validity becomes difficult when any string operation can be applied to the path type (e.g., join(prefix, segments...) vs joinpath(prefix, segments...)).","category":"page"},{"location":"design/#Typed-APIs:-1","page":"Design","title":"Typed APIs:","text":"","category":"section"},{"location":"design/#","page":"Design","title":"Design","text":"Python: pathlib\nRust: std::path\nC++: std::filesystem\nHaskell: path\nScala: os-lib","category":"page"},{"location":"design/#","page":"Design","title":"Design","text":"The primary idea is that a filesystem path is just a sequence of path segments, and so very few path operations overlap with string operations. For example, you're unlikely to call string functions like join(...), chomp(...), eachline(...), match(regex, ...) or parse(Float64, ...) with a filesystem path. Further, differentiating strings and paths allows us to define different equality rules and dispatch behaviour on filepaths in our APIs. Finally, by defining a common API for all AbstractPaths, we can write generic functions that work with PosixPaths, WindowsPaths, S3Paths, FTPPaths, etc.","category":"page"},{"location":"design/#Path-Types-1","page":"Design","title":"Path Types","text":"","category":"section"},{"location":"design/#","page":"Design","title":"Design","text":"In FilePathsBase.jl, file paths are first and foremost a type that wraps a tuple of strings, representing path segments. Most path types will also include a root, drive and separator. Concrete path types should either directly subtype AbstractPath or in the case of local filesystems (e.g., PosixPath, WindowsPath) from SystemPath, as shown in the diagram below.","category":"page"},{"location":"design/#","page":"Design","title":"Design","text":"(Image: Hierarchy)","category":"page"},{"location":"design/#","page":"Design","title":"Design","text":"Notice that our AbstractPath type no longer subtypes AbstractString like some other libraries. We chose drop string subtyping because not all AbstractString operations make sense on paths, and even more seem like they should perform a fundamentally different operation as mentioned above. Similar points have been made for why pathlib.Path doesn't inherit from str in Python.","category":"page"},{"location":"faq/#FAQ-1","page":"FAQ","title":"FAQ","text":"","category":"section"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Here we have a growing list of common technical and design questions folks have raised in the past. If you feel like something is missing, please open an issue or pull request to add it.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q. Should I depend on FilePathsBase.jl and FilePaths.jl?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A. FilePathsBase.jl is a lightweight dependency for packages who need to operate on AbstractPath types and don't need to interact with other packages (e.g., Glob.jl, URIParser.jl, FileIO.jl). FilePaths.jl extends FilePathsBase.jl to improve package interop across the Julia ecosystem, at the cost of extra dependencies. In general, FilePathsBase.jl should be used for general (low level) packages. While scripts and application-level packages should use FilePaths.jl.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q. What's wrong with strings?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A. In many cases, nothing. For local filesystem paths, there's often no functional difference between using an AbstractPath and a String. Some cases where the path type distinction is useful include:","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Path specific operations (e.g., join, /, ==)\nDispatch on paths vs strings (e.g., project(name::String) = project(DEFAULT_ROOT / name))","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"See design section for more details on the advantages of path types over strings.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q. Why is AbstractPath not a subtype of AbstractString?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A. Initially, we made AbstractPath a subtype of AbstractString, but falling back to string operations often didn't make sense (e.g., ascii(::AbstractPath), chomp(::AbstractPath), match(::Regex, ::AbstractPath), parse(::Type{Float64}, ::AbstractPath)). Having a distinct path type results in fewer confusing error messages and more explicit code (via type conversions). See issue #15 for more info on why we dropped string subtyping.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q. Why don't you concatenate paths with *?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A. By using / for path concatenation (joinpath), we can continue to support string concatenation with *:","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"julia> cwd() / \"src\" / \"FilePathsBase\" * \".jl\"\np\"/Users/rory/repos/FilePathsBase.jl/src/FilePathsBase.jl","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q. How do I write code that works with strings and paths?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A. FilePathsBase.jl intentionally provides aliases for Base.Filesystem functions, so you can perform base filesystem operations on strings and paths interchangeable. If something is missing please open an issue or pull request. Here are some more concrete tips to help you write generic code:","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Don't overly constrain your argument types.\nAvoid manual string manipulations (e.g., match, replace).\nStick to the overlapping base filesystem aliases (e.g., joinpath vs /, normpath vs normalize).","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"NOTE: The first 2 points are just general best practices independent of path types. Unfortunately, the last point is a result of the Base.Filesystem API (could change if FilePathsBase.jl becomes a stdlib).","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"See the usage guide for examples.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Q: FilePathsBase doesn't work with package X?","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"A: In many cases, filepath types and strings are interchangable, but if a specific package constrains the argument type (e.g., AbstractString, String) then you'll get a MethodError. There are a few solutions to this problem.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"Loosen the argument type constraint in the given package.\nAdd a separate dispatch for AbstractPath and add a dependency on FilePathsBase.jl.\nFor very general/lightweight packages we can add the dependency to FilePaths.jl and extend the offending function there.\nManually convert your path to a string before calling into the package.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"You may need to parse any returned paths to back to a filepath type if necessary.","category":"page"},{"location":"faq/#","page":"FAQ","title":"FAQ","text":"NOTE: For larger packages, FilePaths.jl provides an @convert macro which will handle generating appropriate conversion methods for you.","category":"page"},{"location":"api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"To compare and contrast FilePathsBase with Base.Filesystem we provide tables for common operations. Use ? at the REPL to get the documentation and arguments as they may be different than the base implementations.","category":"page"},{"location":"api/#Operations-1","page":"API","title":"Operations","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"A table of common operations with Filesystem and FilePathsBase.","category":"page"},{"location":"api/#","page":"API","title":"API","text":"Filesystem FilePathsBase.jl\n\"/home/user/docs\" p\"/home/user/docs\"\nN/A Path()\npwd() pwd(SystemPath) or cwd()\nhomedir() homedir(SystemPath) or home()\ncd() cd()\njoinpath() /\nbasename() basename()\nN/A hasparent, parents, parent\nsplitext splitext\nN/A filename\nN/A extension\nN/A extensions\nispath exists\nrealpath canonicalize\nnormpath normalize\nabspath absolute\nrelpath relative\nstat stat\nlstat lstat\nfilemode mode\nfilesize filesize\nmtime modified\nctime created\nisdir isdir\nisfile isfile\nislink islink\nissocket issocket\nisfifo isfifo\nischardev ischardev\nisblockdev isblockdev\nisexecutable (deprecated) isexecutable\niswritable (deprecated) iswritable\nisreadable (deprecated) isreadable\nismount ismount\nisabspath isabsolute\nsplitdrive()[1] drive\nN/A root (property)\nsplit(p, \"/\") segments (property)\nexpanduser expanduser\nmkdir mkdir\nmkpath N/A (use mkdir)\nsymlink symlink\ncp cp\nmv mv\ndownload download\nreaddir readdir\nN/A readpath\nwalkpath walkpath\nrm rm\ntouch touch\ntempname() tempname(::Type{<:AbstractPath}) (or tmpname)\ntempdir() tempdir(::Type{<:AbstractPath}) (or tmpdir)\nmktemp() mktemp(::Type{<:AbstractPath}) (or mktmp)\nmktempdir() mktempdir(::Type{<:AbstractPath}) (or mktmpdir)\nchmod chmod (recursive unix-only)\nchown (unix only) chown (unix only)\nread read\nwrite write\n@DIR @PATH\n@FILE @FILEPATH","category":"page"},{"location":"api/#Aliases-1","page":"API","title":"Aliases","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"A slightly reduced list of operations/aliases that will work with both strings and path types. The Filesystem and FilePathsBase columns indicate what type will be returned from each each library. As you'd expect, most return types match the input argument(s).","category":"page"},{"location":"api/#","page":"API","title":"API","text":"Function Name Filesystem FilePathsBase\ncd AbstractString AbstractPath\njoinpath AbstractString AbstractPath\nbasename AbstractString AbstractString\nsplitext (AbstractString, AbstractString) (AbstractPath, AbstractString)\nispath Bool Bool\nrealpath AbstractString AbstractPath\nnormpath AbstractString AbstractPath\nabspath AbstractString AbstractPath\nrelpath AbstractString AbstractPath\nstat StatStruct FilePathsBase.Status\nlstat StatStruct FilePathsBase.Status\nfilemode UInt64 FilePathsBase.Mode\nfilesize Int64 Int64\nmtime Float64 Float64\nctime Float64 Float64\nisdir Bool Bool\nisfile Bool Bool\nislink Bool Bool\nissocket Bool Bool\nisfifo Bool Bool\nischardev Bool Bool\nisblockdev Bool Bool\nismount Bool Bool\nisabspath Bool Bool\nexpanduser AbstractString AbstractPath\nmkdir AbstractString AbstractPath\nmkpath AbstractString AbstractPath\nsymlink Nothing Nothing\ncp AbstractString AbstractPath\nmv AbstractString AbstractPath\ndownload AbstractString AbstractPath\nreaddir AbstractString AbstractString\nrm Nothing Nothing\ntouch AbstractString AbstractPath\nchmod AbstractString AbstractPath\nchown AbstractString AbstractPath\nread(fp, T) T T\nwrite Int64 Int64","category":"page"},{"location":"api/#","page":"API","title":"API","text":"DocTestSetup = quote\n    using FilePathsBase\n    using FilePathsBase: /\nend","category":"page"},{"location":"api/#","page":"API","title":"API","text":"FilePathsBase.AbstractPath\nFilePathsBase.Path\nFilePathsBase.SystemPath\nFilePathsBase.PosixPath\nFilePathsBase.WindowsPath\nFilePathsBase.Mode\nFilePathsBase.@p_str\nFilePathsBase.@__PATH__\nFilePathsBase.@__FILEPATH__\nFilePathsBase.@LOCAL\nFilePathsBase.cwd\nFilePathsBase.home\nFilePathsBase.hasparent\nFilePathsBase.parents\nFilePathsBase.parent\nBase.:(*)(::P, ::Union{P, AbstractString, Char}...) where P <: AbstractPath\nFilePathsBase.:(/)(::AbstractPath, ::Union{AbstractPath, AbstractString}...)\nFilePathsBase.join(::T, ::Union{AbstractPath, AbstractString}...) where T <: AbstractPath\nFilePathsBase.filename(::AbstractPath)\nFilePathsBase.extension(::AbstractPath)\nFilePathsBase.extensions(::AbstractPath)\nBase.isempty(::AbstractPath)\nnormalize(::T) where {T <: AbstractPath}\nabsolute(::AbstractPath)\nFilePathsBase.isabsolute(::AbstractPath)\nFilePathsBase.relative(::T, ::T) where {T <: AbstractPath}\nBase.readlink(::AbstractPath)\nFilePathsBase.canonicalize(::AbstractPath)\nFilePathsBase.mode(::AbstractPath)\nFilePathsBase.modified(::AbstractPath)\nFilePathsBase.created(::AbstractPath)\nFilePathsBase.isexecutable\nBase.iswritable(::PosixPath)\nBase.isreadable(::PosixPath)\nBase.cp(::AbstractPath, ::AbstractPath)\nBase.mv(::AbstractPath, ::AbstractPath)\nBase.download(::AbstractString, ::AbstractPath)\nFilePathsBase.readpath\nFilePathsBase.walkpath\nBase.open(::AbstractPath)\nFilePathsBase.tmpname\nFilePathsBase.tmpdir\nFilePathsBase.mktmp\nFilePathsBase.mktmpdir\nBase.chown(::PosixPath, ::AbstractString, ::AbstractString)\nBase.chmod(::PosixPath, ::Mode)\nFilePathsBase.TestPaths\nFilePathsBase.TestPaths.PathSet","category":"page"},{"location":"api/#FilePathsBase.AbstractPath","page":"API","title":"FilePathsBase.AbstractPath","text":"AbstractPath\n\nDefines an abstract filesystem path.\n\nProperties\n\nsegments::Tuple{Vararg{String}} - path segments (required)\nroot::String - path root (defaults to \"/\")\ndrive::String - path drive (defaults to \"\")\nseparator::String - path separator (defaults to \"/\")\n\nRequired Methods\n\ntryparse(::Type{T}, str::String) - For parsing string representations of your path\nread(path::T)\nwrite(path::T, data)\nexists(path::T - whether the path exists\nstat(path::T) - File status describing permissions, size and creation/modified times\nmkdir(path::T; kwargs...) - Create a new directory\nrm(path::T; kwags...) - Remove a file or directory\nreaddir(path::T) - Scan all files and directories at a specific path level\n\n\n\n\n\n","category":"type"},{"location":"api/#FilePathsBase.Path","page":"API","title":"FilePathsBase.Path","text":"Path() -> SystemPath\nPath(fp::Tuple) -> SystemPath\nPath(fp::AbstractString) -> AbstractPath\nPath(fp::P; overrides...) -> P\n\nResponsible for creating the appropriate platform specific path (e.g., PosixPath and WindowsPath` for Unix and Windows systems respectively)\n\n\n\n\n\n","category":"function"},{"location":"api/#FilePathsBase.SystemPath","page":"API","title":"FilePathsBase.SystemPath","text":"SystemPath\n\nA union of PosixPath and WindowsPath which is used for writing methods that wrap base functionality.\n\n\n\n\n\n","category":"type"},{"location":"api/#FilePathsBase.PosixPath","page":"API","title":"FilePathsBase.PosixPath","text":"PosixPath()\nPosixPath(str)\n\nRepresents any posix path (e.g., /home/user/docs)\n\n\n\n\n\n","category":"type"},{"location":"api/#FilePathsBase.WindowsPath","page":"API","title":"FilePathsBase.WindowsPath","text":"WindowsPath()\nWindowsPath(str)\n\nRepresents a windows path (e.g., C:\\User\\Documents)\n\n\n\n\n\n","category":"type"},{"location":"api/#FilePathsBase.Mode","page":"API","title":"FilePathsBase.Mode","text":"Mode(m::UInt8)\nMode(;user::UInt8=0o0, group::UInt8=0o0, other::UInt8=0o0)\nMode(mode::UInt8, usr_grps::Symbol...)\nMode(str)\n\nProvides an abstraction for working with posix file permissions. A lot of the low level permissions code for this type was below and the corresponding constants have been translated from cpython's Lib/stat.py.\n\nExample\n\njulia> Mode(\"-rwxr-x--x\")\n-rwxr-x--x\n\n\n\n\n\n","category":"type"},{"location":"api/#FilePathsBase.@p_str","page":"API","title":"FilePathsBase.@p_str","text":"@p_str -> Path\n\nConstructs a Path (platform specific subtype of AbstractPath), such as p\"~/.juliarc.jl\".\n\n\n\n\n\n","category":"macro"},{"location":"api/#FilePathsBase.@__PATH__","page":"API","title":"FilePathsBase.@__PATH__","text":"@__PATH__ -> SystemPath\n\n@PATH expands to a path with the directory part of the absolute path of the file containing the macro. Returns an empty Path if run from a REPL or if evaluated by julia -e <expr>.\n\n\n\n\n\n","category":"macro"},{"location":"api/#FilePathsBase.@__FILEPATH__","page":"API","title":"FilePathsBase.@__FILEPATH__","text":"@__FILEPATH__ -> SystemPath\n\n@FILEPATH expands to a path with the absolute file path of the file containing the macro. Returns an empty Path if run from a REPL or if evaluated by julia -e <expr>.\n\n\n\n\n\n","category":"macro"},{"location":"api/#FilePathsBase.@LOCAL","page":"API","title":"FilePathsBase.@LOCAL","text":"@LOCAL(filespec)\n\nConstruct an absolute path to filespec relative to the source file containing the macro call.\n\n\n\n\n\n","category":"macro"},{"location":"api/#FilePathsBase.cwd","page":"API","title":"FilePathsBase.cwd","text":"  cwd() -> SystemPath\n\nGet the current working directory.\n\nExamples\n\njulia> cwd()\np\"/home/JuliaUser\"\n\njulia> cd(p\"/home/JuliaUser/Projects/julia\")\n\njulia> cwd()\np\"/home/JuliaUser/Projects/julia\"\n\n\n\n\n\n","category":"function"},{"location":"api/#FilePathsBase.hasparent","page":"API","title":"FilePathsBase.hasparent","text":"hasparent(fp::AbstractPath) -> Bool\n\nReturns whether there is a parent directory component to the supplied path.\n\n\n\n\n\n","category":"function"},{"location":"api/#FilePathsBase.parents","page":"API","title":"FilePathsBase.parents","text":"parents{T<:AbstractPath}(fp::T) -> Array{T}\n\nReturn all parents of the path. If no parent exists then either \"/\" or \".\" will be returned depending on whether the path is absolute.\n\nExample\n\n```jldoctest julia> parents(p\"~/.julia/v0.6/REQUIRE\") 3-element Array{FilePathsBase.PosixPath,1}:  p\"~\"  p\"~/.julia\"  p\"~/.julia/v0.6\"\n\njulia> parents(p\"/etc\") 1-element Array{PosixPath,1}:  p\"/\"\n\njulia> parents(p\"etc\") 1-element Array{PosixPath,1}:  p\".\"\n\njulia> parents(p\".\") 1-element Array{PosixPath,1}:  p\".\"  ```\n\n\n\n\n\n","category":"function"},{"location":"api/#Base.parent","page":"API","title":"Base.parent","text":"parent{T<:AbstractPath}(fp::T) -> T\n\nReturns the parent of the supplied path. If no parent exists then either \"/\" or \".\" will be returned depending on whether the path is absolute.\n\nExample\n\njulia> parent(p\"~/.julia/v0.6/REQUIRE\")\np\"~/.julia/v0.6\"\n\njulia> parent(p\"/etc\")\np\"/\"\n\njulia> parent(p\"etc\")\np\".\"\n\njulia> parent(p\".\")\np\".\"\n\n\n\n\n\n","category":"function"},{"location":"api/#Base.:*-Union{Tuple{P}, Tuple{P,Vararg{Union{Char, AbstractString, P},N} where N}} where P<:AbstractPath","page":"API","title":"Base.:*","text":"*(a::T, b::Union{T, AbstractString, AbstractChar}...) where {T <: AbstractPath} -> T\n\nConcatenate paths, strings and/or characters, producing a new path. This is equivalent to concatenating the string representations of paths and other strings and then constructing a new path.\n\nExample\n\njulia> p\"foo\" * \"bar\"\np\"foobar\"\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.:/-Tuple{AbstractPath,Vararg{Union{AbstractString, AbstractPath},N} where N}","page":"API","title":"FilePathsBase.:/","text":"/(a::AbstractPath, b::Union{AbstractPath, AbstractString}...) -> AbstractPath\n\nJoin the path components into a new full path, equivalent to calling joinpath.\n\nExample\n\njulia> p\"foo\" / \"bar\"\np\"foo/bar\"\n\njulia> p\"foo\" / \"bar\" / \"baz\"\np\"foo/bar/baz\"\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.join-Union{Tuple{T}, Tuple{T,Vararg{Union{AbstractString, AbstractPath},N} where N}} where T<:AbstractPath","page":"API","title":"FilePathsBase.join","text":"join(root::AbstractPath, pieces::Union{AbstractPath, AbstractString}...) -> AbstractPath\n\nJoins path components into a full path.\n\nExample\n\njulia> join(p\"~/.julia/v0.6\", \"REQUIRE\")\np\"~/.julia/v0.6/REQUIRE\"\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.filename-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.filename","text":"filename(fp::AbstractPath) -> AbstractString\n\nExtracts the basename without the extension.\n\nExample\n\njulia> filename(p\"~/repos/FilePathsBase.jl/src/FilePathsBase.jl\")\n\"FilePathsBase\"\n\njulia> filename(p\"~/Downloads/julia-1.4.0-linux-x86_64.tar.gz\")\n\"julia-1.4.0-linux-x86_64.tar\"\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.extension-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.extension","text":"extension(fp::AbstractPath) -> AbstractString\n\nExtracts the last extension from a filename if there any, otherwise it returns an empty string.\n\nExample\n\njulia> extension(p\"~/repos/FilePathsBase.jl/src/FilePathsBase.jl\")\n\"jl\"\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.extensions-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.extensions","text":"extensions(fp::AbstractPath) -> AbstractString\n\nExtracts all extensions from a filename if there any, otherwise it returns an empty string.\n\nExample\n\njulia> extensions(p\"~/repos/FilePathsBase.jl/src/FilePathsBase.jl.bak\")\n2-element Array{SubString{String},1}:\n \"jl\"\n \"bak\"\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.isempty-Tuple{AbstractPath}","page":"API","title":"Base.isempty","text":"isempty(fp::AbstractPath) -> Bool\n\nReturns whether or not a path is empty.\n\nNOTE: Empty paths are usually only created by Path(), as p\"\" and Path(\"\") will default to using the current directory (or p\".\").\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.normalize-Union{Tuple{T}, Tuple{T}} where T<:AbstractPath","page":"API","title":"FilePathsBase.normalize","text":"normalize(fp::AbstractPath) -> AbstractPath\n\nnormalizes a path by removing \".\" and \"..\" entries.\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.absolute-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.absolute","text":"absolute(fp::AbstractPath) -> AbstractPath\n\nCreates an absolute path by adding the current working directory if necessary.\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.isabsolute-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.isabsolute","text":"isabsolute(fp::AbstractPath) -> Bool\n\nReturns true if fp.root is not empty, indicating that it is an absolute path.\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.relative-Union{Tuple{T}, Tuple{T,T}} where T<:AbstractPath","page":"API","title":"FilePathsBase.relative","text":"relative{T<:AbstractPath}(fp::T, start::T=cwd())\n\nCreates a relative path from either the current directory or an arbitrary start directory.\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.canonicalize-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.canonicalize","text":"canonicalize(path::AbstractPath) -> AbstractPath\n\nCanonicalize a path by making it absolute, . or .. segments and resolving any symlinks if applicable.\n\nWARNING: Fallback behaviour ignores symlinks and should be extended for paths where symlinks are permitted (e.g., SystemPaths).\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.mode-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.mode","text":"mode(fp::AbstractPath) -> Mode\n\nReturns the Mode for the specified path.\n\nExample\n\njulia> mode(p\"src/FilePathsBase.jl\")\n-rw-r--r--\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.modified-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.modified","text":"modified(fp::AbstractPath) -> DateTime\n\nReturns the last modified date for the path.\n\nExample\n\njulia> modified(p\"src/FilePathsBase.jl\")\n2017-06-20T04:01:09\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.created-Tuple{AbstractPath}","page":"API","title":"FilePathsBase.created","text":"created(fp::AbstractPath) -> DateTime\n\nReturns the creation date for the path.\n\nExample\n\njulia> created(p\"src/FilePathsBase.jl\")\n2017-06-20T04:01:09\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.isexecutable","page":"API","title":"FilePathsBase.isexecutable","text":"isexecutable(fp::SystemPath) -> Bool\n\nReturns whether the path is executable for the current user.\n\n\n\n\n\n","category":"function"},{"location":"api/#Base.iswritable-Tuple{PosixPath}","page":"API","title":"Base.iswritable","text":"iswritable(fp::AbstractPath) -> Bool\n\nReturns whether the path is writable for the current user.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.isreadable-Tuple{PosixPath}","page":"API","title":"Base.isreadable","text":"isreadable(fp::SystemPath) -> Bool\n\nReturns whether the path is readable for the current user.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.Filesystem.cp-Tuple{AbstractPath,AbstractPath}","page":"API","title":"Base.Filesystem.cp","text":"cp(src::AbstractPath, dst::AbstractPath; force=false, follow_symlinks=false)\n\nCopy the file or directory from src to dst. An existing dst will only be overwritten if force=true. If the path types support symlinks then follow_symlinks=true will copy the contents of the symlink to the destination.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.Filesystem.mv-Tuple{AbstractPath,AbstractPath}","page":"API","title":"Base.Filesystem.mv","text":"mv(src::AbstractPath, dst::AbstractPath; force=false)\n\nMove the file or director from src to dst. An exist dst will only be overwritten if force=true.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.download-Tuple{AbstractString,AbstractPath}","page":"API","title":"Base.download","text":"download(url::Union{AbstractString, AbstractPath}, localfile::AbstractPath)\n\nDownload a file from the remote url and save it to the localfile path.\n\nNOTE: Not downloading into a localfile directory matches the base Julia behaviour. https://github.com/rofinn/FilePathsBase.jl/issues/48\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.readpath","page":"API","title":"FilePathsBase.readpath","text":"readpath(fp::P) where {P <: AbstractPath} -> Vector{P}\n\n\n\n\n\n","category":"function"},{"location":"api/#FilePathsBase.walkpath","page":"API","title":"FilePathsBase.walkpath","text":"walkpath(fp::AbstractPath; topdown=true, follow_symlinks=false, onerror=throw)\n\nPerforms a depth first search through the directory structure\n\n\n\n\n\n","category":"function"},{"location":"api/#Base.open-Tuple{AbstractPath}","page":"API","title":"Base.open","text":"open(filename::AbstractPath; keywords...) -> FileBuffer   open(filename::AbstractPath, mode=\"r) -> FileBuffer\n\nReturn a default FileBuffer for open calls to paths which only support read and write methods. See base open docs for details on valid keywords.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.Filesystem.chown-Tuple{PosixPath,AbstractString,AbstractString}","page":"API","title":"Base.Filesystem.chown","text":"chown(fp::SystemPath, user::AbstractString, group::AbstractString; recursive=false)\n\nChange the user and group of the fp.\n\n\n\n\n\n","category":"method"},{"location":"api/#Base.Filesystem.chmod-Tuple{PosixPath,Mode}","page":"API","title":"Base.Filesystem.chmod","text":"chmod(fp::SystemPath, mode::Mode; recursive=false)\nchmod(fp::SystemPath, mode::Integer; recursive=false)\nchmod(fp::SystemPath, user::UIn8=0o0, group::UInt8=0o0, other::UInt8=0o0; recursive=false)\nchmod(fp::SystemPath, symbolic_mode::AbstractString; recursive=false)\n\nProvides various methods for changing the mode of a fp.\n\nExamples\n\njulia> touch(p\"newfile\")\nBase.Filesystem.File(false, RawFD(-1))\n\njulia> mode(p\"newfile\")\n-rw-r--r--\n\njulia> chmod(p\"newfile\", 0o755)\n\njulia> mode(p\"newfile\")\n-rwxr-xr-x\n\njulia> chmod(p\"newfile\", \"-x\")\n\njulia> mode(p\"newfile\")\n-rw-r--r--\n\njulia> chmod(p\"newfile\", user=(READ+WRITE+EXEC), group=(READ+EXEC), other=READ)\n\njulia> mode(p\"newfile\")\n-rwxr-xr--\n\njulia> chmod(p\"newfile\", mode(p\"src/FilePathsBase.jl\"))\n\njulia> mode(p\"newfile\")\n-rw-r--r--\n\n\n\n\n\n","category":"method"},{"location":"api/#FilePathsBase.TestPaths","page":"API","title":"FilePathsBase.TestPaths","text":"TestPaths\n\nThis module is intended to be used for testing new path types to ensure that they are adhering to the AbstractPath API.\n\nExample\n\n# Create a PathSet\nps = PathSet(; symlink=true)\n\n# Select the subset of tests to run\n# Inspect TestPaths.TESTALL to see full list\ntestsets = [\n    test_registration,\n    test_show,\n    test_parse,\n    test_convert,\n    test_components,\n    test_parents,\n    test_join,\n    test_splitext,\n    test_basename,\n    test_filename,\n    test_extensions,\n    test_isempty,\n    test_normalize,\n    test_canonicalize,\n    test_relative,\n    test_absolute,\n    test_isdir,\n    test_isfile,\n    test_stat,\n    test_filesize,\n    test_modified,\n    test_created,\n    test_cd,\n    test_readpath,\n    test_walkpath,\n    test_read,\n    test_write,\n    test_mkdir,\n    test_cp,\n    test_mv,\n    test_sync,\n    test_symlink,\n    test_touch,\n    test_tmpname,\n    test_tmpdir,\n    test_mktmp,\n    test_mktmpdir,\n    test_download,\n]\n\n# Run all the tests\ntest(ps, testsets)\n\n\n\n\n\n","category":"module"},{"location":"api/#FilePathsBase.TestPaths.PathSet","page":"API","title":"FilePathsBase.TestPaths.PathSet","text":"PathSet(root::AbstractPath=tmpdir(); symlink=false)\n\nConstructs a common test path hierarchy to running shared API tests.\n\nHierarchy:\n\nroot\n|-- foo\n|   |-- baz.txt\n|-- bar\n|   |-- qux\n|       |-- quux.tar.gz\n|-- fred\n|   |-- plugh\n\n\n\n\n\n","category":"type"}]
}
