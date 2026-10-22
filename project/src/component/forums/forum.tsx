import "./forum.scss";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    LuSearch,
    LuPlus,
    LuMessageCircle,
    LuStethoscope,
    LuUsers,
    LuImage,
    LuThumbsUp,
    LuTrash2,
    LuX
} from "react-icons/lu";
import { AllergenIcon } from "../Allergens/Allergens";

import { PostModel, ReplyModel } from "../../models/forum";
import { customerModel } from "../../models/customer";
import {
    GetAllPosts,
    AddPost,
        AddReply,
    ToggleLike,
    DeletePost,
    DeleteReply,
    UploadForumImage
} from "../../service/wines";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { ALLERGENS, getAllergen } from "../../models/allergens";
const LikeIcon: React.FC<{ liked: boolean }> = ({ liked }) =>
    <LuThumbsUp fill={liked ? "currentColor" : "none"} aria-hidden="true" />;

type ForumType = "community" | "expert";
type ForumState = {
    userSlice: {
        currentUser: customerModel | null;
    };
};

// פוסטים ישנים נכתבו בפורום הצליאק, ולכן בלי סימון הם נחשבים כפוסטים על גלוטן
const postSensitivity = (post: PostModel) => post.sensitivity || "gluten";

const sensitivityLabel = (key: string) =>
    key === "general"
        ? "כללי"
        : getAllergen(key)?.label || key;

// כל כמה זמן נטען מחדש את הפורום כדי לראות תגובות של משתמשים אחרים
const REFRESH_INTERVAL_MS = 10000;

const countReplies = (replies: ReplyModel[] = []): number =>
    replies.reduce(
        (total, reply) => total + 1 + countReplies(reply.replies || []),
        0
    );

const collectReplyIds = (replies: ReplyModel[] = [], ids = new Set<number>()) => {
    for (const reply of replies) {
        ids.add(reply.id);
        collectReplyIds(reply.replies || [], ids);
    }
    return ids;
};

const findReply = (replies: ReplyModel[] = [], id: number): ReplyModel | null => {
    for (const reply of replies) {
        if (reply.id === id)
            return reply;
        const found = findReply(reply.replies || [], id);
        if (found)
            return found;
    }
    return null;
};

const insertReply = (
    replies: ReplyModel[] = [],
    parentId: number | null,
    newReply: ReplyModel
): ReplyModel[] => {
    if (parentId === null)
        return [...replies, newReply];

    return replies.map(reply =>
        reply.id === parentId
            ? { ...reply, replies: [...(reply.replies || []), newReply] }
            : { ...reply, replies: insertReply(reply.replies || [], parentId, newReply) }
    );
};

const removeReply = (replies: ReplyModel[] = [], id: number): ReplyModel[] =>
    replies
        .filter(reply => reply.id !== id)
        .map(reply => ({ ...reply, replies: removeReply(reply.replies || [], id) }));

const formatDate = (createdAt?: string, fallback?: string) => {
    if (!createdAt)
        return fallback || "";

    const date = new Date(createdAt);
    if (isNaN(date.getTime()))
        return fallback || "";

    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "עכשיו";
    if (minutes < 60) return `לפני ${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? "לפני שעה" : `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? "אתמול" : `לפני ${days} ימים`;
    return date.toLocaleDateString("he-IL");
};

const Forum: FC = () => {

    const [forumType, setForumType] =
        useState<ForumType>("community");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("הכל");
    const location = useLocation();
    // אפשר לפתוח פוסט ישירות מ"הרשימה שלי"
    const [selectedPostId, setSelectedPostId] = useState<number | null>(
        location.state?.openId !== undefined ? Number(location.state.openId) : null
    );
    const [newReply, setNewReply] = useState("");
    const [replyImage, setReplyImage] = useState<File | null>(null);
    const replyImageInputRef = useRef<HTMLInputElement>(null);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [showCreatePost, setShowCreatePost] = useState(false);

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    const [postCategory, setPostCategory] = useState("מתכונים");
    const [newPostSensitivity, setNewPostSensitivity] = useState("general");
    const [sensitivityFilter, setSensitivityFilter] = useState<string>(
        getAllergen(location.state?.sensitivity)?.key || "all"
    );

    const [image, setImage] = useState<File | null>(null);
    const postImageInputRef = useRef<HTMLInputElement>(null);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [highlightedReplyId, setHighlightedReplyId] = useState<number | null>(null);

    const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
    // מונה שינויים - מונע מטעינה ברקע לדרוס תגובה/לייק שנשמרו בזמן שהיא רצה
    const mutationVersion = useRef(0);

    const user = useSelector(
        (state: ForumState) => state.userSlice.currentUser
    );

    const selectedPost = useMemo(
        () => posts.find(post => post.id === selectedPostId) || null,
        [posts, selectedPostId]
    );

    const replaceLocalPost = (updatedPost: PostModel) =>
        setPosts(currentPosts =>
            currentPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
        );

    const loadPosts = useCallback(async () => {
        const versionAtStart = mutationVersion.current;
        const res = await GetAllPosts();
        if (versionAtStart === mutationVersion.current)
            setPosts(res.data);
    }, []);

    useEffect(() => {
        let isMounted = true;
        loadPosts()
            .catch(error => {
                console.error(error);
                if (isMounted)
                    setErrorMessage("לא ניתן לטעון את הפורום כרגע. יש לנסות שוב.");
            })
            .finally(() => {
                if (isMounted)
                    setIsLoading(false);
            });

        const refresh = () => {
            if (!document.hidden)
                loadPosts().catch(error => console.error(error));
        };
        const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);
        window.addEventListener("focus", refresh);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
            window.removeEventListener("focus", refresh);
        };
    }, [loadPosts]);

    useEffect(() => {
        if (highlightedReplyId === null)
            return;
        document
            .getElementById(`reply-${highlightedReplyId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        const timeoutId = window.setTimeout(() => setHighlightedReplyId(null), 2500);
        return () => window.clearTimeout(timeoutId);
    }, [highlightedReplyId]);

    useEffect(() => {
        if (selectedPostId === null && !showCreatePost)
            return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedPostId(null);
                setReplyingTo(null);
                setShowCreatePost(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectedPostId, showCreatePost]);

    const categories = [
        "הכל",
        "מתכונים",
        "מוצרים",
        "מסעדות",
        "טיולים",
                "בריאות",
        "ילדים",
        "אירועים ואירוח"
    ];

    const filteredPosts =
        useMemo(() => {

            return posts.filter(post => {

                if (
                    forumType === "expert" &&
                    !post.isExpert
                )
                    return false;

                if (
                    forumType === "community" &&
                    post.isExpert
                )
                    return false;

                const normalizedSearch = search.trim().toLocaleLowerCase();
                const matchSearch =
                    post.title.toLocaleLowerCase().includes(normalizedSearch) ||
                    post.content.toLocaleLowerCase().includes(normalizedSearch);

                                const matchCategory =
                    category === "הכל" ||
                    post.category === category;

                const matchSensitivity =
                    sensitivityFilter === "all" ||
                    postSensitivity(post) === sensitivityFilter;

                return (
                    matchSearch &&
                    matchCategory &&
                    matchSensitivity
                );

            });

        }, [
            posts,
            search,
                        category,
            forumType,
            sensitivityFilter
        ]);

        // מספר הפוסטים בכל פורום רגישות (בלשונית הנוכחית - קהילה/מומחים)
    const sensitivitySections = useMemo(() => {
        const postsInTab = posts.filter(post =>
            forumType === "expert" ? post.isExpert : !post.isExpert
        );
        const countFor = (key: string) =>
            postsInTab.filter(post => postSensitivity(post) === key).length;
        const mySensitivities: string[] = user?.sensitivities || [];

        return [
            { key: "all", label: "כל הפורומים", title: "כל הפורומים", count: postsInTab.length, isMine: false },
            ...ALLERGENS.map(allergen => ({
                key: allergen.key as string,
                label: allergen.label,
                title: `פורום ${allergen.label}`,
                count: countFor(allergen.key),
                isMine: mySensitivities.includes(allergen.key)
            })),
            { key: "general", label: "כללי", title: "פורום כללי", count: countFor("general"), isMine: false }
        ];
    }, [posts, forumType, user]);

    const currentSection = sensitivitySections.find(section => section.key === sensitivityFilter);

        // מי שכתב או מנהל. תוכן ישן בלי authorId מזוהה לפי השם
    const canModify = (item: { authorId?: number | string | null; author: string }) => {
        if (!user)
            return false;
        if (user.isAdmin)
            return true;
        if (item.authorId !== undefined && item.authorId !== null)
            return String(item.authorId) === String(user.id);
        return item.author === user.name;
    };

    const deletePost = async (post: PostModel) => {
        if (!user || !window.confirm(`למחוק את הפוסט "${post.title}"? גם כל התגובות יימחקו.`))
            return;
        try {
            await DeletePost(post.id, user.id);
            mutationVersion.current++;
            setPosts(currentPosts => currentPosts.filter(p => p.id !== post.id));
            if (selectedPostId === post.id)
                closePost();
        } catch (error) {
            console.error(error);
            setErrorMessage("מחיקת הפוסט נכשלה. יש לנסות שוב.");
        }
    };

    const deleteReply = async (reply: ReplyModel) => {
        if (!user || !selectedPost)
            return;
        const hasChildren = (reply.replies || []).length > 0;
        if (!window.confirm(hasChildren ? "למחוק את התגובה? גם התשובות אליה יימחקו." : "למחוק את התגובה?"))
            return;
        try {
            const response = await DeleteReply(selectedPost.id, reply.id, user.id);
            mutationVersion.current++;
            replaceLocalPost(response.data.data);
            if (replyingTo === reply.id)
                setReplyingTo(null);
        } catch (error) {
            console.error(error);
            setErrorMessage("מחיקת התגובה נכשלה. יש לנסות שוב.");
        }
    };

    const isLikedByUser = (post: PostModel) =>
        !!user && (post.likedBy || []).map(String).includes(String(user.id));

    const openPost = (postId: number) => {
        setSelectedPostId(postId);
        setReplyingTo(null);
        setNewReply("");
        setReplyImage(null);
        setErrorMessage("");
    };

    const closePost = () => {
        setSelectedPostId(null);
        setReplyingTo(null);
        setErrorMessage("");
    };

    const startReplyTo = (replyId: number) => {
        setReplyingTo(replyId);
        replyTextareaRef.current?.focus();
        replyTextareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const toggleLike = async (id: number) => {
        if (!user) {
            setErrorMessage("יש להתחבר כדי לעשות לייק.");
            return;
        }

        const previousPost = posts.find(post => post.id === id);
        if (!previousPost)
            return;

        // עדכון מיידי במסך, ואז אישור מהשרת
        const userKey = String(user.id);
        const likedBy = (previousPost.likedBy || []).map(String);
        const wasLiked = likedBy.includes(userKey);
        mutationVersion.current++;
        replaceLocalPost({
            ...previousPost,
            likes: Math.max(0, (previousPost.likes || 0) + (wasLiked ? -1 : 1)),
            likedBy: wasLiked ? likedBy.filter(likeId => likeId !== userKey) : [...likedBy, userKey]
        });

        try {
            const response = await ToggleLike(id, user.id);
            mutationVersion.current++;
            replaceLocalPost(response.data.data);
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            mutationVersion.current++;
            replaceLocalPost(previousPost);
            setErrorMessage("לא ניתן לעדכן את הלייק. יש לנסות שוב.");
        }
    };

    const addReply = async () => {
        if (!user) {
            setErrorMessage("יש להתחבר כדי להגיב.");
            return;
        }
        if (!selectedPost || !newReply.trim() || isSubmittingReply)
            return;

        const postId = selectedPost.id;
        const parentId = replyingTo !== null && findReply(selectedPost.replies, replyingTo)
            ? replyingTo
            : null;
        const text = newReply.trim();
        const imageFile = replyImage;
        const existingIds = collectReplyIds(selectedPost.replies);

        // התגובה מופיעה מיד, עוד לפני שהשרת מאשר
        setIsSubmittingReply(true);
        let imageUrl = "";
        if (imageFile) {
            try {
                imageUrl = await UploadForumImage(imageFile);
            } catch (error) {
                console.error(error);
                setErrorMessage("העלאת התמונה נכשלה. יש לנסות שוב.");
                setIsSubmittingReply(false);
                return;
            }
        }

        const tempId = -Date.now();
        const tempReply: ReplyModel = {
            id: tempId,
            author: user.name,
            authorId: user.id,
            text,
            image: imageUrl,
            isExpert: Boolean(user.isAdmin),
            createdAt: new Date().toISOString(),
            replies: []
        };
        mutationVersion.current++;
        setPosts(currentPosts => currentPosts.map(post =>
            post.id === postId
                ? { ...post, replies: insertReply(post.replies || [], parentId, tempReply) }
                : post
        ));
        setNewReply("");
        setReplyImage(null);
        setReplyingTo(null);
        setErrorMessage("");

        try {
            const response = await AddReply(postId, {
                author: user.name,
                authorId: user.id,
                isExpert: Boolean(user.isAdmin),
                text,
                image: imageUrl,
                replyingTo: parentId
            });
            const updatedPost: PostModel = response.data.data;
            mutationVersion.current++;
            replaceLocalPost(updatedPost);
            if (replyImageInputRef.current)
                replyImageInputRef.current.value = "";

            const savedReplyId = Array.from(collectReplyIds(updatedPost.replies))
                .find(id => !existingIds.has(id));
            if (savedReplyId !== undefined)
                setHighlightedReplyId(savedReplyId);
        } catch (error) {
            console.error(error);
            mutationVersion.current++;
            setPosts(currentPosts => currentPosts.map(post =>
                post.id === postId
                    ? { ...post, replies: removeReply(post.replies || [], tempId) }
                    : post
            ));
            // מחזירים את הטקסט כדי שלא ילך לאיבוד
            setNewReply(current => current.trim() ? current : text);
            setReplyImage(current => current || imageFile);
            setReplyingTo(parentId);
            setErrorMessage("שמירת התגובה נכשלה. התגובה לא נוספה, יש לנסות שוב.");
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const createPost = async () => {
        if (!user) {
            setErrorMessage("יש להתחבר כדי לפרסם פוסט.");
            return;
        }
        if (!title.trim() || !content.trim()) {
            setErrorMessage("יש למלא כותרת ותוכן לפני הפרסום.");
            return;
        }

        setIsCreatingPost(true);
        setErrorMessage("");
        try {
            const imageUrl = image ? await UploadForumImage(image) : "";
            const response = await AddPost({
                author: user.name,
                authorId: user.id,
                title: title.trim(),
                content: content.trim(),
                category: postCategory,
                image: imageUrl,
                                isExpert: forumType === "expert",
                sensitivity: newPostSensitivity
            });
            const newPost: PostModel = response.data.data;
            mutationVersion.current++;
            setPosts(currentPosts => [...currentPosts, newPost]);
            setTitle("");
            setContent("");
            setImage(null);
            if (postImageInputRef.current)
                postImageInputRef.current.value = "";
                        setPostCategory("מתכונים");
            setNewPostSensitivity("general");
            setShowCreatePost(false);
            setCategory("הכל");
            setSearch("");
            openPost(newPost.id);
        } catch (error) {
            console.error(error);
            setErrorMessage("פרסום הפוסט נכשל. יש לנסות שוב.");
        } finally {
            setIsCreatingPost(false);
        }
    };

    const replyingToReply = selectedPost && replyingTo !== null
        ? findReply(selectedPost.replies, replyingTo)
        : null;

    const renderReply = (reply: ReplyModel, depth = 0): React.ReactNode => {
        const isPending = reply.id < 0;
        return (
            <div
                key={reply.id}
                id={`reply-${reply.id}`}
                className={`reply-card${depth > 0 ? " child" : ""}${isPending ? " pending" : ""}${highlightedReplyId === reply.id ? " highlighted" : ""}`}
            >
                <div className="reply-header">
                    <div className="author-row">
                        <strong>{reply.author}</strong>
                        {reply.isExpert && (
                            <span className="expert-badge">
                                <LuStethoscope />
                                מומחה
                            </span>
                        )}
                    </div>
                    <span>{isPending ? "שומר..." : formatDate(reply.createdAt, reply.date)}</span>
                </div>
                <p>{reply.text}</p>
                {reply.image && (
                    <img src={reply.image} className="reply-image" alt="" />
                )}
                                {!isPending && (
                    <div className="reply-actions">
                        <button
                            className="reply-button"
                            onClick={() => startReplyTo(reply.id)}
                        >
                            השב
                        </button>
                        {canModify(reply) && (
                            <button
                                className="reply-delete"
                                onClick={() => deleteReply(reply)}
                            >
                                מחק
                            </button>
                        )}
                    </div>
                )}
                {reply.replies?.length > 0 && (
                    <div className="nested-replies">
                        {reply.replies.map(child => renderReply(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };
    return (
        <div className="Forum">
            <div className="Forum-shell">
                {/* Hero */}
                <div className="forum-hero">
                    <div className="hero-text">
                        <h1>פורום הקהילה</h1>
                        <p>
                            מקום אחד לשאול מומחים, לקבל המלצות מהקהילה ולשתף חוויות - לכל רגישות מזון.
                        </p>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <LuUsers />
                            <div>
                                <strong>{posts.filter(p => !p.isExpert).length}</strong>
                                <span>פוסטים בקהילה</span>
                            </div>
                        </div>

                        <div className="stat">
                            <LuStethoscope />
                            <div>
                                <strong>{posts.filter(p => p.isExpert).length}</strong>
                                <span>פוסטים של מומחים</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="forum-tabs">
                    <button
                        className={forumType === "community" ? "active" : ""}
                        onClick={() => setForumType("community")}
                    >
                        <LuUsers />
                        הקהילה
                    </button>

                    <button
                        className={forumType === "expert" ? "active" : ""}
                        onClick={() => setForumType("expert")}
                    >
                        <LuStethoscope />
                        שאלו את המומחה
                    </button>
                </div>

                                {/* פורומים לפי רגישות */}
                <div className="sensitivity-forums" role="tablist" aria-label="פורומים לפי רגישות">
                    {sensitivitySections.map(section => (
                        <button
                            key={section.key}
                            role="tab"
                            aria-selected={sensitivityFilter === section.key}
                            className={`sensitivity-forum${sensitivityFilter === section.key ? " active" : ""}${section.isMine ? " mine" : ""}`}
                            onClick={() => setSensitivityFilter(section.key)}
                        >
                            <AllergenIcon allergenKey={section.key} size={18} className="sensitivity-forum-icon" />
                            <span className="sensitivity-forum-name">{section.label}</span>
                            <span className="sensitivity-forum-count">{section.count} פוסטים</span>
                        </button>
                    ))}
                </div>

                {sensitivityFilter !== "all" && (
                    <h2 className="sensitivity-forum-title">
                        {currentSection?.title}
                    </h2>
                )}

                {/* Toolbar */}
                <div className="forum-toolbar">
                    <div className="search-box">
                        <LuSearch />
                        <input
                            type="text"
                            placeholder="חיפוש בפוסטים..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                                        

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        aria-label="סינון לפי נושא"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <button
                        className="new-post-btn"
                        onClick={() => {
                            if (!user) {
                                setErrorMessage("יש להתחבר כדי לפרסם פוסט.");
                                return;
                            }
                                                        setErrorMessage("");
                            setNewPostSensitivity(sensitivityFilter === "all" ? "general" : sensitivityFilter);
                            setShowCreatePost(true);
                        }}
                    >
                        <LuPlus />
                        פוסט חדש
                    </button>
                </div>

                {errorMessage && !selectedPost && !showCreatePost && (
                    <p className="forum-message error" role="alert">
                        {errorMessage}
                    </p>
                )}

                {/* Create Post Modal */}
                {showCreatePost && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowCreatePost(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>יצירת פוסט חדש</h2>
                            {errorMessage && (
                                <p className="forum-message error" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            <input
                                type="text"
                                placeholder="כותרת הפוסט"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                                                        <select
                                value={newPostSensitivity}
                                onChange={(e) => setNewPostSensitivity(e.target.value)}
                                aria-label="רגישות"
                            >
                                <option value="general">כללי - לא קשור לרגישות מסוימת</option>
                                {ALLERGENS.map(allergen => (
                                    <option key={allergen.key} value={allergen.key}>
                                        {allergen.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={postCategory}
                                onChange={(e) => setPostCategory(e.target.value)}
                                aria-label="נושא"
                            >
                                {categories
                                    .filter(c => c !== "הכל")
                                    .map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                            </select>

                            <textarea
                                placeholder="כתבו את תוכן הפוסט..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <div className="image-field">
                                <LuImage />
                                <input
                                    ref={postImageInputRef}
                                    type="file"
                                    accept="image/*"
                                    title="הוספת תמונה מהמחשב (אופציונלי)"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="secondary"
                                    onClick={() => setShowCreatePost(false)}
                                >
                                    ביטול
                                </button>

                                <button
                                    className="primary"
                                    onClick={createPost}
                                    disabled={isCreatingPost}
                                >
                                    {isCreatingPost ? "מפרסם..." : "פרסם פוסט"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="posts-grid">
                    {isLoading ? (
                        <p className="forum-message" role="status">טוען את הפורום...</p>
                    ) : filteredPosts.length === 0 ? (
                        <p className="forum-message">לא נמצאו פוסטים מתאימים.</p>
                    ) : filteredPosts.map(post => (
                        <article
                            key={post.id}
                            className="post-card"
                            onClick={() => openPost(post.id)}
                        >
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="post-image"
                                />
                            )}

                            <div className="post-content">
                                <div className="post-meta">
                                    <div className="author-row">
                                        <span className="author">{post.author}</span>
                                        {post.isExpert && (
                                            <span className="expert-badge">
                                                <LuStethoscope />
                                                מומחה
                                            </span>
                                        )}
                                    </div>

                                    <span className="date">{formatDate(post.createdAt, post.date)}</span>
                                </div>

                                                                <div className="post-badges">
                                    <span className="sensitivity-badge">
                                        <AllergenIcon allergenKey={postSensitivity(post)} size={13} />
                                        {sensitivityLabel(postSensitivity(post))}
                                    </span>
                                    <span className="category-badge">
                                        {post.category}
                                    </span>
                                </div>

                                <h3>{post.title}</h3>

                                <p>
                                    {post.content.length > 140
                                        ? post.content.slice(0, 140) + "..."
                                        : post.content}
                                </p>

                                <div className="post-actions">
                                    <button
                                        className="like-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(post.id);
                                        }}
                                    >
                                        <LikeIcon liked={isLikedByUser(post)} />
                                        <span>{post.likes}</span>
                                    </button>

                                                                        <div className="comments-count">
                                        <LuMessageCircle />
                                        <span>{countReplies(post.replies || [])}</span>
                                    </div>

                                    <div className="post-save">
                                        <FavoriteButton itemId={post.id} type="forum" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Post Details Modal */}
                {selectedPost && (
                    <div
                        className="modal-overlay"
                        onClick={closePost}
                    >
                        <div
                            className="modal-content post-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="close-btn"
                                aria-label="סגור"
                                onClick={closePost}
                            >
                                <LuX size={20} />
                            </button>
                            {errorMessage && (
                                <p className="forum-message error" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            {selectedPost.image && (
                                <img
                                    src={selectedPost.image}
                                    alt={selectedPost.title}
                                    className="modal-image"
                                />
                            )}

                            <div className="modal-post-header">
                                <div className="author-row">
                                    <strong>{selectedPost.author}</strong>
                                    {selectedPost.isExpert && (
                                        <span className="expert-badge">
                                            <LuStethoscope />
                                            מומחה
                                        </span>
                                    )}
                                </div>

                                <span>{formatDate(selectedPost.createdAt, selectedPost.date)}</span>
                            </div>

                                                        <div className="post-badges">
                                <span className="sensitivity-badge">
                                    <AllergenIcon allergenKey={postSensitivity(selectedPost)} size={13} />
                                    {sensitivityLabel(postSensitivity(selectedPost))}
                                </span>
                                <span className="category-badge">
                                    {selectedPost.category}
                                </span>
                            </div>

                            <h2>{selectedPost.title}</h2>

                            <p className="modal-content-text">
                                {selectedPost.content}
                            </p>

                            <div className="modal-like-row">
                                <button
                                    className="like-btn large"
                                    onClick={() => toggleLike(selectedPost.id)}
                                >
                                    <LikeIcon liked={isLikedByUser(selectedPost)} />
                                                                        <span>{selectedPost.likes} לייקים</span>
                                </button>
                                                                <FavoriteButton itemId={selectedPost.id} type="forum" showLabel />
                                {canModify(selectedPost) && (
                                    <button
                                        className="post-delete"
                                        onClick={() => deletePost(selectedPost)}
                                    >
                                        <LuTrash2 size={16} aria-hidden="true" />
                                        מחק פוסט
                                    </button>
                                )}
                            </div>

                            <div className="replies-section">
                                <h3>תגובות ({countReplies(selectedPost.replies || [])})</h3>

                                {user ? (
                                    <div className="reply-form">
                                        {replyingToReply && (
                                            <div className="replying-message">
                                                משיב/ה ל{replyingToReply.author}
                                                <button
                                                    type="button"
                                                    onClick={() => setReplyingTo(null)}
                                                >
                                                    ביטול
                                                </button>
                                            </div>
                                        )}
                                        <textarea
                                            ref={replyTextareaRef}
                                            placeholder="כתבו תגובה... (Ctrl+Enter לשליחה)"
                                            value={newReply}
                                            onChange={(e) => setNewReply(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                                    e.preventDefault();
                                                    addReply();
                                                }
                                            }}
                                        />
                                        <div className="image-field">
                                            <LuImage />
                                            <input
                                                ref={replyImageInputRef}
                                                type="file"
                                                accept="image/*"
                                                title="הוספת תמונה לתגובה מהמחשב (אופציונלי)"
                                                onChange={(e) =>
                                                    setReplyImage(e.target.files?.[0] || null)} />
                                        </div>

                                        <button
                                            onClick={addReply}
                                            disabled={isSubmittingReply || !newReply.trim()}
                                        >
                                            {isSubmittingReply ? "שומר תגובה..." : "שלח תגובה"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="forum-message">יש להתחבר כדי להגיב.</p>
                                )}

                                <div className="replies-list">
                                    {(selectedPost.replies || []).length === 0 ? (
                                        <p className="forum-message">אין עדיין תגובות. היו הראשונים להגיב!</p>
                                    ) : (selectedPost.replies || []).map(reply => renderReply(reply))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forum;
