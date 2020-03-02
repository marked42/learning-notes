# Emotion

1. cache
2. theme
3. jsx babel-macro/babel plugin/babel pragma
4. 服务端渲染
5. keyframes
6. media query
7. css prop
8. class cx
9. tagged template literal
10. serializeStyles
11. insertStyles
12. global style
13. context
14. react ref

## Usage

1. 框架无关的css，不能使用使用`theme`和`props`，有单独的`EmotionCache`
    ```jsx
    import { css, cx } from 'emotion'

    const color = 'white'

    render(
      <div
        className={css`
          padding: 32px;
          background-color: hotpink;
          font-size: 24px;
          border-radius: 4px;
          &:hover {
            color: ${color};
          }
        `}
      >
        Hover to change color.
      </div>
    )
    ```
1. 使用`styled.div`形式API，可以组合使用`props => {}`的函数，从`props.theme`获取`theme`对象。
    ```jsx
    import styled from '@emotion/styled'

    const Button = styled.button`
      color: ${props =>
        props.primary ? 'hotpink' : 'turquoise'};
    `

    const Container = styled.div(props => ({
      display: 'flex',
      flexDirection: props.column && 'column'
    }))

    render(
      <Container column>
        <Button>This is a regular button.</Button>
        <Button primary>This is a primary button.</Button>
      </Container>
    )
    ```
1. 使用`css`属性，可以直接接受Object，String，theme => Object | String 函数形式，或者css``调用
    ```jsx
    /** @jsx jsx */
    import { jsx } from '@emotion/core'

    // object style
    render(
      <div
        css={{
          backgroundColor: 'hotpink',
          '&:hover': {
            color: 'lightgreen'
          }
        }}
      >
        This has a hotpink background.
      </div>
    )
    ```

    ```jsx
    /** @jsx jsx */
    import { css, jsx } from '@emotion/core'

    const color = 'darkgreen'

    render(
      <div
        css={css`
          background-color: hotpink;
          &:hover {
            color: ${color};
          }
        `}
      >
        This has a hotpink background.
      </div>
    )
    ```

    ```jsx
    /** @jsx jsx */
    import { css, jsx } from '@emotion/core'

    const color = 'darkgreen'

    render(
      <div
        css={theme => css`
          background-color: hotpink;
          &:hover {
            color: ${theme.color};
          }
        `}
      >
        This has a hotpink background.
      </div>
    )
    ```

    ```jsx
    /** @jsx jsx */
    import { css, jsx } from '@emotion/core'

    const color = 'darkgreen'

    // 可以直接使用this.props.color形式，css不接受像styled.div中使用props => any形式的函数，
    render(
      <div
        css={theme => css`
          background-color: hotpink;
          &:hover {
            color: ${this.props.color};
          }
        `}
      >
        This has a hotpink background.
      </div>
    )
    ```
