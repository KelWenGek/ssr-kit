<script>
    import convert from '@/shared/convert';
    export default {
        name: 'comment-content',
        props: ['content', 'beReplied', 'isRepliedCnt'],
        render(h) {
            let cnt = convert.parseContent(this.content).map(c => {
                if (c.type === 'text') {
                    return h('span', {
                        class: {
                            'cmt_text': !(this.beReplied && this.beReplied.length)
                        },
                        domProps: {
                            innerHTML: c.content
                        }
                    });
                } else if (c.type === 'image') {
                    return h('img', {
                        class: {
                            'cmt_emoji': true
                        },
                        attrs: {
                            src: c.content,
                            alt: '',
                        },
                        style: {
                            width: '21px',
                            height: '21px'
                        }
                    })
                }
            });
            if (this.isRepliedCnt) {
                return h('span', {
                    class: {
                        'cmt_replied_cnt': true
                    }
                }, cnt)
            } else {
                return h('div', {
                    class: {
                        'cmt_content': true
                    }
                }, this.beReplied && this.beReplied.length ? ['回复', h('a', {
                    class: {
                        at: true
                    },
                    attr: {
                        href: this.beReplied[0].user.nicknameUrl
                    },
                    domProps: {
                        innerHTML: `@${this.beReplied[0].user.nickname}`
                    }
                }), ' ：'].concat(cnt) : cnt)
            }
        }
    }
</script>